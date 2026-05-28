#!/usr/bin/env bash
set -euo pipefail

ALLOW_PLACEHOLDERS="false"
GRACE_PERIOD="false"
ROOT_DIR="."

for arg in "$@"; do
  case "$arg" in
    --allow-placeholders)
      ALLOW_PLACEHOLDERS="true"
      ;;
    --grace-period)
      GRACE_PERIOD="true"
      ;;
    *)
      ROOT_DIR="$arg"
      ;;
  esac
done

cd "$ROOT_DIR"

# 自动检测 Git 提交次数以识别冷启动阶段
if [[ "$GRACE_PERIOD" != "true" ]]; then
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo "0")
    if [[ "$COMMIT_COUNT" -lt 10 ]]; then
      echo "[HvAOS] Automatically active Grace Period (commits: $COMMIT_COUNT < 10)"
      GRACE_PERIOD="true"
    fi
  fi
fi

REQUIRED_MD_FILES=(
  "01-intent.md"
  "02-rules.md"
  "03-processes.md"
  "04-context.md"
  "05-acceptance.md"
)

REQUIRED_MDC_FILES=(
  ".hvaos/01-intent.mdc"
  ".hvaos/02-rules.mdc"
  ".hvaos/03-processes.mdc"
  ".hvaos/04-context.mdc"
  ".hvaos/05-acceptance.mdc"
)

# 兼容 macOS 和 Linux 的 md5 获取函数
get_md5() {
  local file="$1"
  if command -v md5 >/dev/null 2>&1; then
    md5 -q "$file"
  elif command -v md5sum >/dev/null 2>&1; then
    md5sum "$file" | awk '{print $1}'
  else
    echo "unknown_md5"
  fi
}

fail() {
  local msg="$1"
  if [[ "${GRACE_PERIOD}" == "true" ]]; then
    echo "[HvAOS Grace Period Warning] $msg" >&2
  else
    echo "[HvAOS Blocked] $msg" >&2
    exit 1
  fi
}

echo "[INFO] Running HvAOS verification in: $(pwd)"

# ==========================================
# 🛡️ 核心配置防篡改校验 (物理硬门禁, 宽限期不放行)
# ==========================================
if [[ -f "package.json" && -f ".hvaos/package.json.hash" ]]; then
  CURRENT_HASH=$(get_md5 "package.json")
  EXPECTED_HASH=$(cat ".hvaos/package.json.hash" | tr -d '[:space:]')
  
  if [[ "$CURRENT_HASH" != "$EXPECTED_HASH" ]]; then
    # 检查是否在 allow-changes.log 白名单中
    AUTHORIZED="false"
    if [[ -f ".hvaos/allow-changes.log" ]]; then
      if grep -q "$CURRENT_HASH" ".hvaos/allow-changes.log"; then
        AUTHORIZED="true"
      fi
    fi
    
    if [[ "$AUTHORIZED" != "true" ]]; then
      echo "[HvAOS Blocked] Core configuration 'package.json' has been tampered!" >&2
      echo "[HvAOS Blocked] Current Hash: $CURRENT_HASH" >&2
      echo "[HvAOS Blocked] Expected: $EXPECTED_HASH" >&2
      echo "[HvAOS Blocked] Please manually sign off this change in .hvaos/allow-changes.log" >&2
      exit 1
    fi
  fi
fi

# ==========================================
# 📝 核心文件与占位符规范审计
# ==========================================
for file in "${REQUIRED_MD_FILES[@]}"; do
  [[ -f "$file" ]] || fail "Missing required file: $file"
done

for file in "${REQUIRED_MDC_FILES[@]}"; do
  [[ -f "$file" ]] || fail "Missing required chip: $file"
done

if [[ "$ALLOW_PLACEHOLDERS" != "true" ]]; then
  if rg -n '\{\{[^}]+\}\}' "${REQUIRED_MD_FILES[@]}" >/dev/null 2>&1; then
    echo "[HvAOS Audit] Unresolved placeholders found in core markdown files:"
    rg -n '\{\{[^}]+\}\}' "${REQUIRED_MD_FILES[@]}" || true
    fail "Placeholders not resolved."
  fi
fi

if [[ "$ALLOW_PLACEHOLDERS" != "true" ]]; then
  for file in "${REQUIRED_MDC_FILES[@]}"; do
    if ! rg -q "STRICT INTERCEPTION|Rule alignment|align all operations" "$file"; then
      fail "Chip appears invalid or empty: $file"
    fi
  done
fi

echo "[OK] HvAOS verification passed."

