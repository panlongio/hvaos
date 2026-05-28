#!/usr/bin/env python3
# -*- coding: utf-8 =*-
# scripts/hvaos-cli.py

import os
import sys
import json
import hashlib
import re
import math
import argparse
from typing import List, Dict, Any, Tuple

# 根目录定位
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))
HVAOS_DIR = os.path.join(REPO_ROOT, ".hvaos")
MEMORIES_DIR = os.path.join(HVAOS_DIR, "memories")

# ==========================================
# ⚙️ 辅助工具函数
# ==========================================

def get_hash(text: str) -> str:
    """计算文本的 MD5 作为文件名哈希"""
    return hashlib.md5(text.strip().encode('utf-8')).hexdigest()[:12]

def clean_word(word: str) -> str:
    """清洗单词"""
    return re.sub(r'[^\w]', '', word.lower())

def tokenize(text: str) -> List[str]:
    """简单的分词器"""
    words = re.findall(r'\b\w+\b', text.lower())
    return [w for w in words if len(w) > 1]

def calculate_cosine_similarity(text1: str, text2: str) -> float:
    """计算两个文本的 Bag-of-Words 余弦相似度"""
    words1 = tokenize(text1)
    words2 = tokenize(text2)
    
    if not words1 or not words2:
        return 0.0
        
    # 构建词频字典
    freq1: Dict[str, int] = {}
    freq2: Dict[str, int] = {}
    
    all_words = set(words1 + words2)
    
    for w in words1:
        freq1[w] = freq1.get(w, 0) + 1
    for w in words2:
        freq2[w] = freq2.get(w, 0) + 1
        
    # 计算余弦
    dot_product = 0.0
    sum1 = 0.0
    sum2 = 0.0
    
    for w in all_words:
        v1 = freq1.get(w, 0)
        v2 = freq2.get(w, 0)
        dot_product += v1 * v2
        sum1 += v1 ** 2
        sum2 += v2 ** 2
        
    if sum1 == 0 or sum2 == 0:
        return 0.0
        
    return dot_product / (math.sqrt(sum1) * math.sqrt(sum2))

# ==========================================
# 📦 核心逻辑 1：记忆分发与无冲突合并
# ==========================================

def bootstrap_memories_if_empty():
    """冷启动过渡：如果 memories 文件夹为空，但 04-context.md 存在，则自动导入已有记忆"""
    os.makedirs(MEMORIES_DIR, exist_ok=True)
    
    # 检查 memories 是否为空
    existing_mems = [f for f in os.listdir(MEMORIES_DIR) if f.endswith(".mem")]
    if existing_mems:
        return
        
    # 读取已有记忆
    context_file = os.path.join(HVAOS_DIR, "04-context.md")
    if not os.path.exists(context_file):
        return
        
    print("[HvAOS] Bootstrapping memories from 04-context.md...")
    with open(context_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # 匹配所有的列表项 `* 记忆`
    items = re.findall(r'^\s*[\*\-]\s*(.+)$', content, re.MULTILINE)
    for item in items:
        # 默认冷启动导入的旧记忆为 locked: true，确保安全防线不丢失
        item_text = item.strip()
        if not item_text:
            continue
        h = get_hash(item_text)
        mem_path = os.path.join(MEMORIES_DIR, f"{h}.mem")
        with open(mem_path, 'w', encoding='utf-8') as mf:
            json.dump({"content": item_text, "locked": True}, mf, ensure_ascii=False, indent=2)
    print(f"[HvAOS] Successfully imported {len(items)} memories to memories/ directory.")

def merge_memories():
    """合并 memories/ 下所有的哈希小文件，输出到 04-context.md 和 04-context.mdc"""
    bootstrap_memories_if_empty()
    
    mem_files = sorted([f for f in os.listdir(MEMORIES_DIR) if f.endswith(".mem")])
    memories: List[Dict[str, Any]] = []
    
    for f in mem_files:
        path = os.path.join(MEMORIES_DIR, f)
        try:
            with open(path, 'r', encoding='utf-8') as mf:
                memories.append(json.load(mf))
        except Exception as e:
            print(f"[WARN] Failed to read memory file {f}: {e}", file=sys.stderr)
            
    if not memories:
        print("[HvAOS] No memories found to merge.")
        return
        
    # 格式化为 Markdown 列表
    markdown_lines = []
    for m in memories:
        lock_icon = " 🔒" if m.get("locked") else ""
        markdown_lines.append(f"* {m['content']}{lock_icon}")
        
    markdown_content = "\n".join(markdown_lines)
    
    # 1. 写入 .hvaos/04-context.md
    with open(os.path.join(HVAOS_DIR, "04-context.md"), 'w', encoding='utf-8') as f:
        f.write(markdown_content + "\n")
        
    # 2. 写入根目录的 04-context.md
    with open(os.path.join(REPO_ROOT, "04-context.md"), 'w', encoding='utf-8') as f:
        f.write(markdown_content + "\n")
        
    # 3. 写入 .hvaos/04-context.mdc (带有 Cursor Frontmatter)
    mdc_template = f"""---
description: hvaos-context: Project specific experience memory, constraints, and workarounds.
globs: *
---
# 04-context

{markdown_content}
"""
    with open(os.path.join(HVAOS_DIR, "04-context.mdc"), 'w', encoding='utf-8') as f:
        f.write(mdc_template)
        
    print(f"[HvAOS] Successfully merged {len(memories)} memory files into 04-context card.")

# ==========================================
# 📦 核心逻辑 2：有损智能剪枝与结构锁
# ==========================================

def prune_memories(threshold: int):
    """智能剪枝：对未锁定的记忆进行去重与合并，保留 locked: true 的负面技术规则"""
    bootstrap_memories_if_empty()
    
    mem_files = [f for f in os.listdir(MEMORIES_DIR) if f.endswith(".mem")]
    
    locked_memories: List[Tuple[str, Dict[str, Any]]] = []
    unlocked_memories: List[Tuple[str, Dict[str, Any]]] = []
    
    for f in mem_files:
        path = os.path.join(MEMORIES_DIR, f)
        try:
            with open(path, 'r', encoding='utf-8') as mf:
                data = json.load(mf)
                if data.get("locked"):
                    locked_memories.append((f, data))
                else:
                    unlocked_memories.append((f, data))
        except Exception as e:
            pass

    total_count = len(locked_memories) + len(unlocked_memories)
    if total_count <= threshold:
        print(f"[HvAOS] Current memory count ({total_count}) is below threshold ({threshold}). No pruning needed.")
        return
        
    print(f"[HvAOS] Pruning memories... (Total: {total_count}, Threshold: {threshold})")
    
    # 对未锁定的记忆进行相似度去重合并
    kept_unlocked: List[Dict[str, Any]] = []
    
    for _, item in unlocked_memories:
        content = item["content"]
        # 与已经保留的未锁定记忆比对
        is_duplicate = False
        for kept in kept_unlocked:
            sim = calculate_cosine_similarity(content, kept["content"])
            if sim > 0.45: # 相似度阈值
                is_duplicate = True
                # 简单粗暴保留长度更长（描述更详尽）的那条
                if len(content) > len(kept["content"]):
                    kept["content"] = content
                break
        if not is_duplicate:
            kept_unlocked.append(item)
            
    # 如果修剪后依然超标，按时间顺序（在原型中简单按照文件名哈希）舍弃最老的未锁定记忆
    allowed_unlocked_count = max(0, threshold - len(locked_memories))
    kept_unlocked = kept_unlocked[:allowed_unlocked_count]
    
    # 物理重建 memories/ 目录下的文件
    # 1. 删除所有旧的未锁定记忆文件
    for filename, _ in unlocked_memories:
        try:
            os.remove(os.path.join(MEMORIES_DIR, filename))
        except:
            pass
            
    # 2. 写入修剪合并后的未锁定记忆
    for item in kept_unlocked:
        h = get_hash(item["content"])
        with open(os.path.join(MEMORIES_DIR, f"{h}.mem"), 'w', encoding='utf-8') as mf:
            json.dump(item, mf, ensure_ascii=False, indent=2)
            
    print(f"[HvAOS] Prune completed. Kept {len(locked_memories)} locked rules and {len(kept_unlocked)} pruned logs.")
    # 重新合并卡片
    merge_memories()

# ==========================================
# 📦 核心逻辑 3：端侧向量化相似度懒加载检索
# ==========================================

def lazy_load_memories(query: str, sim_threshold: float):
    """扫描所有 memory 哈希文件，根据 query 过滤并动态输出相似度 > sim_threshold 的高价值背景知识"""
    bootstrap_memories_if_empty()
    
    mem_files = [f for f in os.listdir(MEMORIES_DIR) if f.endswith(".mem")]
    matched_memories: List[Dict[str, Any]] = []
    
    for f in mem_files:
        path = os.path.join(MEMORIES_DIR, f)
        try:
            with open(path, 'r', encoding='utf-8') as mf:
                data = json.load(mf)
                sim = calculate_cosine_similarity(query, data["content"])
                if sim >= sim_threshold:
                    matched_memories.append(data)
        except:
            pass
            
    # 输出 JSON 格式，方便 CLI 管道或 IDE 流程集成
    print(json.dumps(matched_memories, ensure_ascii=False, indent=2))

# ==========================================
# 🚀 命令行解析与入口
# ==========================================

def main():
    parser = argparse.ArgumentParser(description="HvAOS CLI Toolkit - 人机协作与记忆管理引擎")
    subparsers = parser.add_subparsers(dest="command", required=True)
    
    # merge-memories command
    subparsers.add_parser("merge-memories", help="合并 memories/ 下所有的哈希文件并更新 04-context 卡片")
    
    # prune command
    prune_parser = subparsers.add_parser("prune", help="执行记忆有损智能剪枝，保留 locked: true 的红线")
    prune_parser.add_argument("--threshold", type=int, default=5, help="允许保留的最大记忆条数")
    
    # lazy-load command
    lazy_parser = subparsers.add_parser("lazy-load", help="根据当前 query 进行极轻量本地相似度检索")
    lazy_parser.add_argument("query", type=str, help="大模型当前的 prompt 或 git diff 文本")
    lazy_parser.add_argument("--threshold", type=float, default=0.25, help="相似度阈值")
    
    # add-memory command (辅助手动或AI测试添加)
    add_parser = subparsers.add_parser("add-memory", help="手动向 memories/ 中添加一条新避坑记录")
    add_parser.add_argument("content", type=str, help="记忆描述内容")
    add_parser.add_argument("--locked", action="store_true", help="是否加锁锁定该规则")

    # compile command
    subparsers.add_parser("compile", help="编译双层 rules 并分发至 IDE 的 rules 目录下")

    # wizard command
    subparsers.add_parser("wizard", help="交互式意图引导器，智能生成 01-intent.mdc")
    
    args = parser.parse_args()
    
    if args.command == "merge-memories":
        merge_memories()
    elif args.command == "prune":
        prune_memories(args.threshold)
    elif args.command == "lazy-load":
        lazy_load_memories(args.query, args.threshold)
    elif args.command == "add-memory":
        os.makedirs(MEMORIES_DIR, exist_ok=True)
        h = get_hash(args.content)
        mem_path = os.path.join(MEMORIES_DIR, f"{h}.mem")
        with open(mem_path, 'w', encoding='utf-8') as mf:
            json.dump({"content": args.content, "locked": args.locked}, mf, ensure_ascii=False, indent=2)
        print(f"[HvAOS] Added new memory: {args.content} (locked={args.locked}) -> {h}.mem")
        merge_memories()
    elif args.command == "compile":
        compile_rules()
    elif args.command == "wizard":
        run_intent_wizard()

def run_intent_wizard():
    """交互式意图引导器 (Intent Wizard)"""
    print("==================================================")
    print("🧠 HvAOS 意图对齐引导器 (Intent Wizard)")
    print("==================================================")
    
    try:
        print("\n👉 [Q1] 核心开发目标是什么？(大白话描述, 例如: 写个邮箱登录接口)")
        target = input("> ").strip()
        while not target:
            print("[!] 核心目标不能为空，请重新输入:")
            target = input("> ").strip()
            
        print("\n👉 [Q2] 有哪些高危禁区或禁止修改的文件？(例如: 不要碰 api/auth.py。无限制请按回车)")
        antigoals = input("> ").strip()
        if not antigoals:
            antigoals = "None (无硬性禁区拦截)"
            
        print("\n👉 [Q3] 这次任务的验收 DoD 条件是什么？(例如: npm run build 通过。无限制请按回车)")
        acceptance = input("> ").strip()
        if not acceptance:
            acceptance = "Compile & verify check passed."
    except KeyboardInterrupt:
        print("\n[HvAOS] Wizard canceled by user.")
        return
        
    # 格式化生成 01-intent 内容
    intent_markdown = f"""# 01-intent

## Core Goals (核心开发目标)
- [ ] {target}

## Anti-Goals & Restrictions (高危绝对禁区)
- **[RESTRICTED]** {antigoals}

## Acceptance DoD Assertion (验收质量门禁)
- [ ] {acceptance}
"""

    # 写入文件
    os.makedirs(HVAOS_DIR, exist_ok=True)
    with open(os.path.join(HVAOS_DIR, "01-intent.md"), 'w', encoding='utf-8') as f:
        f.write(intent_markdown + "\n")
    with open(os.path.join(REPO_ROOT, "01-intent.md"), 'w', encoding='utf-8') as f:
        f.write(intent_markdown + "\n")
        
    mdc_template = f"""---
description: hvaos-intent: Project specific development goals, file boundaries, and anti-goals constraint.
globs: *
---
{intent_markdown}
"""
    with open(os.path.join(HVAOS_DIR, "01-intent.mdc"), 'w', encoding='utf-8') as f:
        f.write(mdc_template)
        
    print("\n[OK] 01-intent.mdc 规则芯片已自动智能生成并落盘！")
    
    # 自动执行 compile 动作以同步并分发规则
    compile_rules()

def compile_rules():
    """编译双层 rules (全域 + 本地)，并分发到 IDE 的 rules 目录下"""
    global_rules_dir = os.path.expanduser("~/.hvaos")
    global_rules_path = os.path.join(global_rules_dir, "global-rules.json")
    local_rules_path = os.path.join(HVAOS_DIR, "local-rules.json")
    
    redlines = []
    
    # 1. 读取全域绝对红线
    if os.path.exists(global_rules_path):
        try:
            with open(global_rules_path, 'r', encoding='utf-8') as f:
                g_data = json.load(f)
                redlines.extend(g_data.get("redlines", []))
            print(f"[HvAOS] Loaded {len(g_data.get('redlines', []))} global rules.")
        except Exception as e:
            print(f"[WARN] Failed to read global rules: {e}", file=sys.stderr)
            
    # 2. 读取项目级规范
    if os.path.exists(local_rules_path):
        try:
            with open(local_rules_path, 'r', encoding='utf-8') as f:
                l_data = json.load(f)
                redlines.extend(l_data.get("redlines", []))
            print(f"[HvAOS] Loaded {len(l_data.get('redlines', []))} local rules.")
        except Exception as e:
            print(f"[WARN] Failed to read local rules: {e}", file=sys.stderr)
            
    # 去重并确保至少有一条核心防线
    redlines = list(dict.fromkeys(redlines))
    if not redlines:
        redlines.append("STRICT INTERCEPTION: Enforce strict constraints on all AI operations.")
        redlines.append("Rule alignment: Always check HvAOS rules card before modifying.")
        redlines.append("align all operations: Keep intent fully aligned with human instructions.")
    
    # 3. 构造 02-rules.md
    rules_markdown = "# 02-rules\n\n## STRICT INTERCEPTION & SAFETY REDLINES\n"
    for r in redlines:
        rules_markdown += f"- **[REDLINE]** {r}\n"
        
    # 写入文件
    with open(os.path.join(HVAOS_DIR, "02-rules.md"), 'w', encoding='utf-8') as f:
        f.write(rules_markdown + "\n")
    with open(os.path.join(REPO_ROOT, "02-rules.md"), 'w', encoding='utf-8') as f:
        f.write(rules_markdown + "\n")
        
    mdc_template = f"""---
description: hvaos-rules: Strict development redlines, security constraints, and interception matches.
globs: *
---
{rules_markdown}
"""
    with open(os.path.join(HVAOS_DIR, "02-rules.mdc"), 'w', encoding='utf-8') as f:
        f.write(mdc_template)
        
    print("[HvAOS] Compile completed. Global & local rules merged.")
    
    # 4. 自动分发到 IDE 的规则目录中
    ide_dirs = [
        os.path.join(REPO_ROOT, ".cursor", "rules"),
        os.path.join(REPO_ROOT, ".windsurf", "rules")
    ]
    
    for ide_dir in ide_dirs:
        os.makedirs(ide_dir, exist_ok=True)
        # 将 .hvaos/*.mdc 文件全部拷贝/链接过去
        for item in os.listdir(HVAOS_DIR):
            if item.endswith(".mdc"):
                src = os.path.join(HVAOS_DIR, item)
                dst = os.path.join(ide_dir, item)
                try:
                    with open(src, 'r', encoding='utf-8') as sf:
                        content = sf.read()
                    with open(dst, 'w', encoding='utf-8') as df:
                        df.write(content)
                except Exception as e:
                    print(f"[WARN] Failed to distribute {item} to {ide_dir}: {e}", file=sys.stderr)
                    
    print("[HvAOS] Rules successfully distributed to active IDE config directories.")

if __name__ == "__main__":
    main()
