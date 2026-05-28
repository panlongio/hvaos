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

    # add-skill command
    add_skill_parser = subparsers.add_parser("add-skill", help="通过 npx skills add 动态装载全球开源技能包")
    add_skill_parser.add_argument("package", type=str, help="技能包路径 (例如 vercel-labs/agent-skills@react-best-practices)")

    # fork-agent command
    fork_parser = subparsers.add_parser("fork-agent", help="为子智能体派生一份局部的轻量级用户态规则灵魂包")
    fork_parser.add_argument("--name", type=str, required=True, help="子智能体的名称")
    fork_parser.add_argument("--scope", type=str, default="*", help="子智能体的作用域 (如 db, stripe 或 glob 表达式)")
    
    # merge-agent command
    merge_parser = subparsers.add_parser("merge-agent", help="在子智能体任务结束后，汇总合并其踩坑记忆并物理清退其临时目录")
    merge_parser.add_argument("--name", type=str, required=True, help="子智能体的名称")
    
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
    elif args.command == "add-skill":
        add_skill(args.package)
    elif args.command == "fork-agent":
        fork_agent(args.name, args.scope)
    elif args.command == "merge-agent":
        merge_agent(args.name)

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
        
    print("\n[OK] 01-intent.mdc 规则灵魂已自动智能生成并落盘！")
    
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
    
    # 3. 扫描并加载 rules-pool 中的动态技能（渐进式披露）
    skills_section = ""
    rules_pool_dir = os.path.join(HVAOS_DIR, "rules-pool")
    if os.path.exists(rules_pool_dir):
        skills_found = []
        for item in os.listdir(rules_pool_dir):
            if item.endswith(".md") and item != "README.md":
                skill_filepath = os.path.join(rules_pool_dir, item)
                skill_name = item[:-3]
                desc = extract_description(skill_filepath) or "Specialized guidelines and tools repository."
                skills_found.append((skill_name, desc, skill_filepath))
                
        if skills_found:
            skills_section += "\n## 🔌 AVAILABLE ACTIVE SKILLS (PROGRESSIVE DISCLOSURE)\n\n"
            skills_section += "If your current task aligns with any of the following specialized domains, you must call the `view_file` tool to read the corresponding detailed guidelines before writing code:\n\n"
            for name, desc, path_val in skills_found:
                skills_section += f"- **[SKILL] {name}**: {desc}\n"
                skills_section += f"  - Guidelines: [SKILL.md](file://{path_val})\n"

    # 4. 构造 02-rules.md
    rules_markdown = "# 02-rules\n\n## STRICT INTERCEPTION & SAFETY REDLINES\n"
    for r in redlines:
        rules_markdown += f"- **[REDLINE]** {r}\n"
    if skills_section:
        rules_markdown += skills_section
        
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
    
    # 5. 自动分发到 IDE 的规则目录中
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
        
        # 将 .hvaos/rules-pool/*.mdc 也全部拷贝分发过去以支持 IDE glob 懒加载热匹配
        if os.path.exists(rules_pool_dir):
            for item in os.listdir(rules_pool_dir):
                if item.endswith(".mdc"):
                    src = os.path.join(rules_pool_dir, item)
                    dst = os.path.join(ide_dir, item)
                    try:
                        with open(src, 'r', encoding='utf-8') as sf:
                            content = sf.read()
                        with open(dst, 'w', encoding='utf-8') as df:
                            df.write(content)
                    except Exception as e:
                        print(f"[WARN] Failed to distribute skill config {item} to {ide_dir}: {e}", file=sys.stderr)
                    
    print("[HvAOS] Rules successfully distributed to active IDE config directories.")

def fork_agent(name: str, scope: str):
    """为子智能体派生一份局部的轻量级用户态规则灵魂包"""
    agent_dir = os.path.join(HVAOS_DIR, "agents", name)
    os.makedirs(agent_dir, exist_ok=True)
    
    # 子智能体专用的局部记忆文件夹
    agent_mems_dir = os.path.join(agent_dir, "memories")
    os.makedirs(agent_mems_dir, exist_ok=True)

    print(f"[HvAOS] Forking Sub-Agent '{name}' with scope '{scope}'...")

    # 1. 复制并过滤微内核中的 02-rules 规则
    src_rules = os.path.join(HVAOS_DIR, "02-rules.md")
    rules_markdown = f"# 02-rules (Sub-Agent: {name} | Scope: {scope})\n\n## INHERITED REDLINES & CONSTRAINTS\n"
    
    if os.path.exists(src_rules):
        with open(src_rules, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        for line in lines:
            # 只保留匹配的规则或系统核心防线
            if "[REDLINE]" in line:
                # 系统绝对硬红线直接放行
                if any(k in line.lower() for k in ["spec gate", "credential", "interception"]):
                    rules_markdown += line
                # 局部匹配 scope 规则
                elif scope != "*" and scope.lower() in line.lower():
                    rules_markdown += line
                elif scope == "*":
                    rules_markdown += line
    else:
        rules_markdown += "- **[REDLINE]** STRICT INTERCEPTION: Enforce sub-agent context check.\n"

    # 2. 写入子 Agent 规则文件
    with open(os.path.join(agent_dir, "02-rules.md"), 'w', encoding='utf-8') as f:
        f.write(rules_markdown)
        
    mdc_template = f"""---
description: hvaos-sub-agent-{name} rules matched for scope {scope}.
globs: {scope if "/" in scope or "*" in scope else "*"}
---
{rules_markdown}
"""
    with open(os.path.join(agent_dir, "02-rules.mdc"), 'w', encoding='utf-8') as f:
        f.write(mdc_template)

    # 3. 复制其它的 01-intent, 03-processes, 05-acceptance 等微内核架构文件做只读参考
    for item in ["01-intent.md", "03-processes.md", "05-acceptance.md"]:
        src_file = os.path.join(HVAOS_DIR, item)
        if os.path.exists(src_file):
            with open(src_file, 'r', encoding='utf-8') as sf:
                content = sf.read()
            with open(os.path.join(agent_dir, item), 'w', encoding='utf-8') as df:
                df.write(content)

    print(f"[HvAOS] [SUCCESS] Sub-Agent '{name}' temporary rules initialized under .hvaos/agents/{name}/")

def merge_agent(name: str):
    """子智能体任务结束后，汇总合并其踩坑记忆并物理清退其临时目录"""
    agent_dir = os.path.join(HVAOS_DIR, "agents", name)
    if not os.path.exists(agent_dir):
        print(f"[ERROR] Sub-Agent '{name}' directory not found: {agent_dir}", file=sys.stderr)
        sys.exit(1)
        
    agent_mems_dir = os.path.join(agent_dir, "memories")
    merged_count = 0
    # 确保全局 memories 目录百分之百存在
    os.makedirs(MEMORIES_DIR, exist_ok=True)
    
    # 1. 汇总子 Agent 在本次 Session 产生的 memory 哈希文件并写入主库
    if os.path.exists(agent_mems_dir):
        for f in os.listdir(agent_mems_dir):
            if f.endswith(".mem"):
                src_path = os.path.join(agent_mems_dir, f)
                dst_path = os.path.join(MEMORIES_DIR, f)
                try:
                    with open(src_path, 'r', encoding='utf-8') as sf:
                        data = json.load(sf)
                    with open(dst_path, 'w', encoding='utf-8') as df:
                        json.dump(data, df, ensure_ascii=False, indent=2)
                    merged_count += 1
                except Exception as e:
                    print(f"[WARN] Failed to merge sub-agent memory file {f}: {e}", file=sys.stderr)

    print(f"[HvAOS] Merged {merged_count} memories from Sub-Agent '{name}' to main memory base.")

    # 2. 触发全局记忆重排合并与 04-context 更新
    merge_memories()

    # 3. 物理销毁子 Agent 目录，防止规则膨胀垃圾
    import shutil
    try:
        shutil.rmtree(agent_dir)
        print(f"[HvAOS] Sub-Agent '{name}' temporary rules directory physically destroyed.")
    except Exception as e:
        print(f"[WARN] Failed to clean sub-agent directory: {e}", file=sys.stderr)

def add_skill(package: str):
    """通过 npx skills add 动态装载全球开源技能包，并同步到 rules-pool"""
    print(f"[HvAOS] Executing: npx -y skills add {package} -y ...")
    
    # 1. 运行 shell 安装命令
    import subprocess
    import shutil
    try:
        res = subprocess.run(["npx", "-y", "skills", "add", package, "-y"], 
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if res.returncode != 0:
            print(f"[ERROR] Failed to run npx skills add: {res.stderr}", file=sys.stderr)
            sys.exit(1)
        print(res.stdout)
    except Exception as e:
        print(f"[ERROR] Subprocess error: {e}", file=sys.stderr)
        sys.exit(1)
        
    # 2. 检查 .agents/skills 目录，将新发现的 SKILL.md 自动同步到 .hvaos/rules-pool 目录
    agents_skills_dir = os.path.join(REPO_ROOT, ".agents", "skills")
    rules_pool_dir = os.path.join(HVAOS_DIR, "rules-pool")
    os.makedirs(rules_pool_dir, exist_ok=True)
    
    if not os.path.exists(agents_skills_dir):
        print(f"[WARN] No installed skills found under .agents/skills/", file=sys.stderr)
        return
        
    copied_count = 0
    # 遍历 .agents/skills 中的每个技能文件夹
    for skill_name in os.listdir(agents_skills_dir):
        skill_path = os.path.join(agents_skills_dir, skill_name)
        if os.path.isdir(skill_path):
            md_src = os.path.join(skill_path, "SKILL.md")
            if os.path.exists(md_src):
                # 拷贝为 .hvaos/rules-pool/<skill_name>.md
                dst_name = f"{skill_name}.md"
                md_dst = os.path.join(rules_pool_dir, dst_name)
                try:
                    shutil.copy2(md_src, md_dst)
                    # 同时生成配套的 .mdc 元数据文件以供 Cursor 等 IDE 懒加载做 glob 触发匹配
                    desc = extract_description(md_src) or f"HvAOS rules soul dynamic skill: {skill_name}"
                    mdc_content = f"""---
description: {desc}
globs: *
---
# [SKILL] {skill_name}
To view detailed guidelines for this skill, read the file: file://{md_dst}
"""
                    with open(os.path.join(rules_pool_dir, f"{skill_name}.mdc"), 'w', encoding='utf-8') as mf:
                        mf.write(mdc_content)
                        
                    copied_count += 1
                    print(f"[HvAOS] [SUCCESS] Dynamic skill '{skill_name}' loaded to rules-pool.")
                except Exception as e:
                    print(f"[WARN] Failed to copy skill {skill_name}: {e}", file=sys.stderr)
                    
    # 3. 自动重新编译 rules 并分发
    if copied_count > 0:
        compile_rules()

def extract_description(filepath: str) -> str:
    """从 SKILL.md YAML frontmatter 中提取 description"""
    if not os.path.exists(filepath):
        return None
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        import re
        match = re.search(r"^description:\s*(.*)$", content, re.MULTILINE)
        if match:
            return match.group(1).strip()
    except Exception:
        pass
    return None

if __name__ == "__main__":
    main()
