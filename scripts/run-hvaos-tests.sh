#!/usr/bin/env bash
# scripts/run-hvaos-tests.sh
# HvAOS 回归与验收测试套件

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# 状态追踪
TESTS_RUN=0
TESTS_PASSED=0

log_info() {
  echo -e "\033[1;34m[TEST INFO] $1\033[0m"
}

log_success() {
  echo -e "\033[1;32m[TEST PASS] $1\033[0m"
  TESTS_PASSED=$((TESTS_PASSED + 1))
}

log_fail() {
  echo -e "\033[1;31m[TEST FAIL] $1\033[0m" >&2
}

run_test() {
  TESTS_RUN=$((TESTS_RUN + 1))
  local test_name="$1"
  log_info "Starting Test: $test_name"
  
  if "$@"; then
    log_success "$test_name"
  else
    log_fail "$test_name"
    exit 1
  fi
}

# ==========================================
# 🧪 测试用例 1: 宿主越狱物理拦截与防防篡改测试
# ==========================================
test_anti_tamper() {
  cd "$REPO_ROOT"
  
  # 1. 备份现有的 package.json / .hvaos 状态 (如果存在)
  local has_package_json="false"
  [[ -f "package.json" ]] && has_package_json="true" && mv package.json package.json.bak
  [[ -f ".hvaos/package.json.hash" ]] && mv .hvaos/package.json.hash .hvaos/package.json.hash.bak
  [[ -f ".hvaos/allow-changes.log" ]] && mv .hvaos/allow-changes.log .hvaos/allow-changes.log.bak
  
  # 恢复测试现场的清理钩子
  cleanup() {
    rm -f package.json .hvaos/package.json.hash .hvaos/allow-changes.log
    [[ "$has_package_json" == "true" ]] && mv package.json.bak package.json
    [[ -f ".hvaos/package.json.hash.bak" ]] && mv .hvaos/package.json.hash.bak .hvaos/package.json.hash
    [[ -f ".hvaos/allow-changes.log.bak" ]] && mv .hvaos/allow-changes.log.bak .hvaos/allow-changes.log
  }
  trap cleanup EXIT
  
  # 2. 模拟初始化 package.json 与 hash
  echo '{"name": "test-project", "version": "1.0.0"}' > package.json
  
  # 计算哈希并存入备份
  python3 -c '
import hashlib, json
with open("package.json", "rb") as f:
    h = hashlib.md5(f.read().strip()).hexdigest()
with open(".hvaos/package.json.hash", "w") as out:
    out.write(h)
'
  
  # 正常校验，必须通过
  log_info "Running base verification (expecting pass)..."
  bash scripts/verify-hvaos.sh --allow-placeholders .
  
  # 3. 模拟 AI 篡改 package.json 劫持状态
  echo '{"name": "test-project", "version": "1.0.0", "scripts": {"build": "echo bypass"}}' > package.json
  
  # 再次校验，必须被物理拦截阻断
  log_info "Running verification after tampering (expecting block)..."
  if bash scripts/verify-hvaos.sh --allow-placeholders . >/dev/null 2>&1; then
    log_fail "Tamper bypass detected! Gateway failed to intercept package.json modifications."
    return 1
  fi
  log_info "[OK] Tamper successfully blocked by gateway."
  
  # 4. 模拟人类手动签名放行
  TAMPERED_HASH=$(python3 -c '
import hashlib
with open("package.json", "rb") as f:
    print(hashlib.md5(f.read().strip()).hexdigest())
')
  echo "$TAMPERED_HASH" > .hvaos/allow-changes.log
  
  # 再次校验，由于白名单存在，必须通过
  log_info "Running verification after human sign-off (expecting pass)..."
  bash scripts/verify-hvaos.sh --allow-placeholders .
  
  cleanup
  trap - EXIT
  return 0
}

# ==========================================
# 🧪 测试用例 2: 记忆小文件无冲突合并测试
# ==========================================
test_memory_merge() {
  cd "$REPO_ROOT"
  
  # 备份已有的 memories 目录
  [[ -d ".hvaos/memories" ]] && mv .hvaos/memories .hvaos/memories.bak
  [[ -f ".hvaos/04-context.md" ]] && mv .hvaos/04-context.md .hvaos/04-context.md.bak
  
  cleanup() {
    rm -rf .hvaos/memories
    [[ -d ".hvaos/memories.bak" ]] && mv .hvaos/memories.bak .hvaos/memories
    [[ -f ".hvaos/04-context.md.bak" ]] && mv .hvaos/04-context.md.bak .hvaos/04-context.md
  }
  trap cleanup EXIT
  
  # 1. 模拟写入两个不同的记忆哈希文件
  mkdir -p .hvaos/memories
  echo '{"content": "Next.js routing error: must use client component", "locked": true}' > .hvaos/memories/a1b2c3.mem
  echo '{"content": "Git hooks missing path: install git-lfs", "locked": false}' > .hvaos/memories/d4e5f6.mem
  
  # 2. 运行合并
  python3 scripts/hvaos-cli.py merge-memories
  
  # 3. 验证 04-context.md 中同时包含这两条记忆，且带锁的记忆包含 🔒 标识
  if ! grep -q "Next.js routing error.*🔒" .hvaos/04-context.md; then
    log_fail "Locked memory marker not found or formatted incorrectly!"
    return 1
  fi
  
  if ! grep -q "Git hooks missing path" .hvaos/04-context.md; then
    log_fail "Unlocked memory not merged into context card!"
    return 1
  fi
  
  cleanup
  trap - EXIT
  return 0
}

# ==========================================
# 🧪 测试用例 3: 记忆有损剪枝与结构锁有效性测试
# ==========================================
test_memory_pruning() {
  cd "$REPO_ROOT"
  
  # 备份已有的 memories 目录
  [[ -d ".hvaos/memories" ]] && mv .hvaos/memories .hvaos/memories.bak
  
  cleanup() {
    rm -rf .hvaos/memories
    [[ -d ".hvaos/memories.bak" ]] && mv .hvaos/memories.bak .hvaos/memories
  }
  trap cleanup EXIT
  
  mkdir -p .hvaos/memories
  
  # 1. 写入 4 条加锁记忆 (locked: true)
  for i in {1..4}; do
    echo "{\"content\": \"Critical negative rules #$i: do not use require\", \"locked\": true}" > ".hvaos/memories/locked$i.mem"
  done
  
  # 2. 写入 4 条未加锁的临时日志 (locked: false)
  # 其中日志 1 和 2 相似，用于触发文本聚类合并
  echo '{"content": "Terminal alias setup failed on zsh", "locked": false}' > .hvaos/memories/unlocked1.mem
  echo '{"content": "Terminal alias setup failed on bash shell", "locked": false}' > .hvaos/memories/unlocked2.mem
  echo '{"content": "Wrangler log output overflow", "locked": false}' > .hvaos/memories/unlocked3.mem
  echo '{"content": "Supabase client local cache expired", "locked": false}' > .hvaos/memories/unlocked4.mem
  
  # 3. 执行剪枝，设置阀值为 5 (总共8条，应该剪裁保留5条)
  python3 scripts/hvaos-cli.py prune --threshold 5
  
  # 4. 验证结果
  # 4条带锁规则必须 100% 存在，未带锁日志被智能合并/删除剩下1条
  local final_count
  final_count=$(find .hvaos/memories -name "*.mem" | wc -l | tr -d '[:space:]')
  
  if [[ "$final_count" -ne 5 ]]; then
    log_fail "Prune count discrepancy! Expected exactly 5 memories, got $final_count"
    return 1
  fi
  
  # 确认所有 locked 规则都在
  for i in {1..4}; do
    if ! grep -q "Critical negative rules #$i" .hvaos/04-context.md; then
      log_fail "Locked rule #$i was incorrectly pruned!"
      return 1
    fi
  done
  
  cleanup
  trap - EXIT
  return 0
}

# ==========================================
# 🧪 测试用例 4: 意图引导器格式化落盘测试
# ==========================================
test_wizard_alignment() {
  cd "$REPO_ROOT"
  
  # 备份现有的 01-intent 文件状态 (如果存在)
  [[ -f "01-intent.md" ]] && mv 01-intent.md 01-intent.md.bak
  [[ -f ".hvaos/01-intent.md" ]] && mv .hvaos/01-intent.md .hvaos/01-intent.md.bak
  [[ -f ".hvaos/01-intent.mdc" ]] && mv .hvaos/01-intent.mdc .hvaos/01-intent.mdc.bak
  [[ -f ".cursor/rules/01-intent.mdc" ]] && mv .cursor/rules/01-intent.mdc .cursor/rules/01-intent.mdc.bak
  
  cleanup() {
    rm -f 01-intent.md .hvaos/01-intent.md .hvaos/01-intent.mdc .cursor/rules/01-intent.mdc
    [[ -f "01-intent.md.bak" ]] && mv 01-intent.md.bak 01-intent.md
    [[ -f ".hvaos/01-intent.md.bak" ]] && mv .hvaos/01-intent.md.bak .hvaos/01-intent.md
    [[ -f ".hvaos/01-intent.mdc.bak" ]] && mv .hvaos/01-intent.mdc.bak .hvaos/01-intent.mdc
    [[ -f ".cursor/rules/01-intent.mdc.bak" ]] && mv .cursor/rules/01-intent.mdc.bak .cursor/rules/01-intent.mdc
  }
  trap cleanup EXIT
  
  # 模拟用户通过命令行 stdin 回答 3 个引导问题
  # Q1: Write login API
  # Q2: do not touch secure.py
  # Q3: pytest passes
  log_info "Invoking hvaos-cli.py wizard with mock stdin..."
  printf "Write login API\ndo not touch secure.py\npytest passes\n" | python3 scripts/hvaos-cli.py wizard >/dev/null
  
  # 验证 1：文件是否生成
  if [[ ! -f ".hvaos/01-intent.md" || ! -f ".cursor/rules/01-intent.mdc" ]]; then
    log_fail "Wizard failed to output intent files or compile to IDE rules directory!"
    return 1
  fi
  
  # 验证 2：目标、禁区和验收条件是否正确格式化落盘
  if ! grep -q "Write login API" .hvaos/01-intent.md; then
    log_fail "Wizard missed core goals in final Markdown!"
    return 1
  fi
  
  if ! grep -q "do not touch secure.py" .hvaos/01-intent.md; then
    log_fail "Wizard missed anti-goals in final Markdown!"
    return 1
  fi
  
  if ! grep -q "pytest passes" .hvaos/01-intent.md; then
    log_fail "Wizard missed acceptance criteria in final Markdown!"
    return 1
  fi
  
  cleanup
  trap - EXIT
  return 0
}

# ==========================================
# 🚀 启动套件执行
# ==========================================

log_info "=================================================="
log_info "🚀 Running HvAOS System Regression Test Suite..."
log_info "=================================================="

run_test "test_anti_tamper"
run_test "test_memory_merge"
run_test "test_memory_pruning"
run_test "test_wizard_alignment"

log_info "=================================================="
log_info "🎉 HvAOS Test Suite Results: $TESTS_PASSED/$TESTS_RUN passed."
log_info "=================================================="
