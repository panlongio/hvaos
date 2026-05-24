#!/bin/bash
set -euo pipefail

# Immersive Neon ANSI Colors
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
PURPLE='\033[0;35m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

MODE="local"
REMOTE_REF="main"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CHECKSUM_FILE_REL="website/checksums.txt"

usage() {
  cat <<USAGE
Usage: bash website/install.sh [--remote] [--ref <git-ref>] [--help]

Options:
  --remote        Use remote source files from GitHub with checksum verification.
  --ref <ref>     Git ref for remote mode (branch/tag/commit). Default: main
  --help          Show this help message.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --remote)
      MODE="remote"
      shift
      ;;
    --ref)
      REMOTE_REF="${2:-}"
      if [[ -z "$REMOTE_REF" ]]; then
        echo "[ERROR] --ref requires a value" >&2
        exit 1
      fi
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "[ERROR] Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

fetch_remote_text() {
  local path="$1"
  local url="https://raw.githubusercontent.com/panlongio/hvaos/${REMOTE_REF}/${path}"
  if ! curl -fsSL "$url"; then
    echo -e "${RED}[ERROR] Remote fetch failed: $url${NC}" >&2
    echo -e "${YELLOW}[HINT] Confirm ref exists and contains ${CHECKSUM_FILE_REL} (or run local mode).${NC}" >&2
    exit 1
  fi
}

safe_copy_or_fetch() {
  local rel="$1"
  local out="$2"
  if [[ "$MODE" == "remote" ]]; then
    fetch_remote_text "$rel" > "$out"
  else
    cp "$PROJECT_ROOT/$rel" "$out"
  fi
}

verify_checksum() {
  local rel="$1"
  local file="$2"
  local expected
  expected=$(awk -v p="$rel" '$2==p {print $1}' "$CHECKSUMS_FILE")
  [[ -n "$expected" ]] || { echo -e "${RED}[ERROR] Missing checksum entry: $rel${NC}"; exit 1; }
  local actual
  actual=$(shasum -a 256 "$file" | awk '{print $1}')
  [[ "$actual" == "$expected" ]] || {
    echo -e "${RED}[ERROR] Checksum mismatch: $rel${NC}"
    echo "expected=$expected"
    echo "actual=$actual"
    exit 1
  }
}

escape_sed_replacement() {
  printf '%s' "$1" | sed -e 's/[&|\\]/\\&/g'
}

# ASCII Art Welcome Banner
echo -e "${CYAN}"
echo "    __  __            ___  ____  _____"
echo "   / / / /_   ______ / _ \/ __ \/ ___/"
echo "  / /_/ / | |/_/ __ \/ // / /_/ /\__ \\ "
echo " / __  /| |>  < /_/ / ___/\____/___/ /"
echo "/_/ /_/ |_/_/|_\__,_/_/          /____/"
echo -e "${NC}"
echo -e "${PURPLE}HvAOS (Human vs AI OS) — 人机协作与意图对齐网关一键初始化${NC}"
echo -e "-------------------------------------------------------------"

CURRENT_DIR=$(pwd)
PROJECT_DEFAULT_NAME=$(basename "$CURRENT_DIR")

echo -e "📍 目标安装目录: ${GREEN}$CURRENT_DIR${NC}"
if [[ "$MODE" == "remote" ]]; then
  echo -e "🌐 远程模式: GitHub ref=${GREEN}${REMOTE_REF}${NC} (checksum verified)"
else
  echo -e "📦 本地模式: 使用当前仓库模板 (reproducible)"
fi
echo ""

# Load checksum manifest
CHECKSUMS_FILE=$(mktemp)
if [[ "$MODE" == "remote" ]]; then
  fetch_remote_text "$CHECKSUM_FILE_REL" > "$CHECKSUMS_FILE"
else
  cp "$PROJECT_ROOT/$CHECKSUM_FILE_REL" "$CHECKSUMS_FILE"
fi

# Domain Preset Selection
echo -e "${YELLOW}请选择您的项目类型 (Select Domain Preset):${NC}"
echo -e "  [1] 💻 Coding (软件开发与编程场景)"
echo -e "  [2] ✍️ Media (自媒体运营与写稿场景)"
echo -e "  [3] 📅 Life (个人助理与生活理财场景)"
read -p "请输入序号 [1-3] (默认: 1): " PRESET_CHOICE
PRESET_CHOICE=${PRESET_CHOICE:-1}

case $PRESET_CHOICE in
  2)
    PRESET_KEY="media"
    PRESET_NAME="自媒体运营/写稿"
    DEFAULT_MISSION="To publish high-quality, high-retention technical articles."
    ;;
  3)
    PRESET_KEY="life"
    PRESET_NAME="个人助理/理财"
    DEFAULT_MISSION="To maintain weekly calendar block balances and monthly saving targets."
    ;;
  *)
    PRESET_KEY="coding"
    PRESET_NAME="软件开发/编程"
    DEFAULT_MISSION="To build a modular SaaS backend with strict TypeScript and test coverage."
    ;;
esac

echo -e "已选择: ${GREEN}$PRESET_NAME Presets${NC}"
echo ""

read -p "请输入项目名称 (Project Name) [$PROJECT_DEFAULT_NAME]: " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-$PROJECT_DEFAULT_NAME}

read -p "请输入项目核心使命 (Project Mission) [$DEFAULT_MISSION]: " PROJECT_MISSION
PROJECT_MISSION=${PROJECT_MISSION:-$DEFAULT_MISSION}

PROJECT_NAME_ESCAPED=$(escape_sed_replacement "$PROJECT_NAME")
PROJECT_MISSION_ESCAPED=$(escape_sed_replacement "$PROJECT_MISSION")

echo -e "\n🧹 正在生成本地目录结构..."
mkdir -p .hvaos

FILES=("01-intent" "02-rules" "03-processes" "04-context" "05-acceptance")

for file in "${FILES[@]}"; do
  rel_path="presets/${PRESET_KEY}/${file}.md"
  echo -e "📥 正在加载 ${CYAN}${rel_path}${NC} 并填入个性化参数..."

  TEMP_FILE=$(mktemp)
  safe_copy_or_fetch "$rel_path" "$TEMP_FILE"
  verify_checksum "$rel_path" "$TEMP_FILE"

  sed -i '' "s|AcmeSaaS|${PROJECT_NAME_ESCAPED}|g" "$TEMP_FILE" 2>/dev/null || sed -i "s|AcmeSaaS|${PROJECT_NAME_ESCAPED}|g" "$TEMP_FILE"
  sed -i '' "s|TechDaily|${PROJECT_NAME_ESCAPED}|g" "$TEMP_FILE" 2>/dev/null || sed -i "s|TechDaily|${PROJECT_NAME_ESCAPED}|g" "$TEMP_FILE"
  sed -i '' "s|LifeOps|${PROJECT_NAME_ESCAPED}|g" "$TEMP_FILE" 2>/dev/null || sed -i "s|LifeOps|${PROJECT_NAME_ESCAPED}|g" "$TEMP_FILE"

  sed -i '' "s|To build a highly reliable, performant, and secure cloud platform that automates workflows for remote teams, solving the latency and collaboration fragmentation pain points.|${PROJECT_MISSION_ESCAPED}|g" "$TEMP_FILE" 2>/dev/null || sed -i "s|To build a highly reliable, performant, and secure cloud platform that automates workflows for remote teams, solving the latency and collaboration fragmentation pain points.|${PROJECT_MISSION_ESCAPED}|g" "$TEMP_FILE"
  sed -i '' "s|To democratize complex AI and software engineering concepts through engaging, jargon-free, and visually structured articles, helping tech practitioners and enthusiasts stay ahead without feeling overwhelmed.|${PROJECT_MISSION_ESCAPED}|g" "$TEMP_FILE" 2>/dev/null || sed -i "s|To democratize complex AI and software engineering concepts through engaging, jargon-free, and visually structured articles, helping tech practitioners and enthusiasts stay ahead without feeling overwhelmed.|${PROJECT_MISSION_ESCAPED}|g" "$TEMP_FILE"
  sed -i '' "s|To build a balanced, stress-free lifestyle system that optimizes daily focus, preserves physical health, and maintains financial freedom, helping independent builders achieve their goals without burn-out.|${PROJECT_MISSION_ESCAPED}|g" "$TEMP_FILE" 2>/dev/null || sed -i "s|To build a balanced, stress-free lifestyle system that optimizes daily focus, preserves physical health, and maintains financial freedom, helping independent builders achieve their goals without burn-out.|${PROJECT_MISSION_ESCAPED}|g" "$TEMP_FILE"

  mv "$TEMP_FILE" "${file}.md"

  echo -e "🛡️ 正在生成完整芯片 ${PURPLE}.hvaos/${file}.mdc${NC}..."
  cat <<CHIP > ".hvaos/${file}.mdc"
---
description: Rule alignment for ${file} in ${PROJECT_NAME}
globs: *
---
# ${file} MDC chip

🚨 [STRICT INTERCEPTION] If any unresolved double-brace placeholders like "{{PLACEHOLDER}}" exist in your active hvaos rules files (01-intent.md, 02-rules.md, etc.), you are strictly FORBIDDEN from writing any code or making file modifications. Your ONLY permitted action is to guide the user to complete the Bootloader initialization in the chat.

$(cat "${file}.md")
CHIP
done

echo -e "📥 正在加载 ${CYAN}README-HvAOS.md${NC} 使用说明书..."
TMP_README=$(mktemp)
safe_copy_or_fetch "README-HvAOS.md" "$TMP_README"
verify_checksum "README-HvAOS.md" "$TMP_README"
mv "$TMP_README" "README-HvAOS.md"

DETECTED_IDE=""
PARENT_PID=$$

for i in {1..10}; do
  PARENT_PID=$(ps -p "$PARENT_PID" -o ppid= 2>/dev/null | tr -d ' ')
  if [ -z "$PARENT_PID" ] || [ "$PARENT_PID" -eq 1 ] || [ "$PARENT_PID" -eq 0 ]; then
    break
  fi
  PROC_PATH=$(ps -p "$PARENT_PID" -o comm= 2>/dev/null)
  PROC_NAME=$(basename "$PROC_PATH" 2>/dev/null)

  if [[ "$PROC_NAME" =~ [Cc]ursor ]]; then
    DETECTED_IDE="cursor"
    break
  elif [[ "$PROC_NAME" =~ [Tt]rae ]]; then
    DETECTED_IDE="trae"
    break
  elif [[ "$PROC_NAME" =~ [Ww]indsurf ]]; then
    DETECTED_IDE="windsurf"
    break
  elif [[ "$PROC_NAME" =~ [Cc]ode ]]; then
    DETECTED_IDE="cursor"
    break
  fi
done

if [ -z "$DETECTED_IDE" ]; then
  if [ "${TERM_PROGRAM:-}" = "vscode" ] || [ -n "${VSCODE_GIT_IPC_HANDLE:-}" ]; then
    DETECTED_IDE="cursor"
  fi
fi

LINK_INFO=""
case $DETECTED_IDE in
  "cursor")
    echo -e "\n🔗 检测到 Cursor/VSCode 环境，正在建立芯片关联通道 (Linking to .cursor/rules)..."
    mkdir -p .cursor
    ln -sf ../.hvaos .cursor/rules
    LINK_INFO="、\`.cursor/rules\` 软链接芯片"
    ;;
  "trae")
    echo -e "\n🔗 检测到 Trae 环境，正在建立芯片关联通道 (Linking to .trae/rules)..."
    mkdir -p .trae
    ln -sf ../.hvaos .trae/rules
    LINK_INFO="、\`.trae/rules\` 软链接芯片"
    ;;
  "windsurf")
    echo -e "\n🔗 检测到 Windsurf 环境，正在建立芯片关联通道 (Linking to .windsurf/rules)..."
    mkdir -p .windsurf
    ln -sf ../.hvaos .windsurf/rules
    LINK_INFO="、\`.windsurf/rules\` 软链接芯片"
    ;;
  *)
    echo -e "\nℹ️ 未检测到特定 IDE 运行态（如为 OpenClaw, Hermes, Claude Code 等 CLI/Agent），已跳过 IDE 软链接创建，保持目录纯净。"
    LINK_INFO=""
    ;;
esac

echo -e "\n${GREEN}✨ [SUCCESS] HvAOS 规则芯片已全部装载完成！${NC}"
echo -e "💡 已经自动在当前项目根目录下生成了 5 层规则文档、\`.hvaos/\` 核心规则目录以及 \`README-HvAOS.md\` 说明书${LINK_INFO}。"
echo -e "-------------------------------------------------------------"
echo -e "\n📢 [AI ASSISTANT ACTION REQUIRED] 🚀"
echo -e "请 AI 助手立即读取项目根目录下的 \`README-HvAOS.md\` 文件，并执行其中的【AI 智能启动与初始化协议】，自动启动与人类的问答交互！"
echo -e "-------------------------------------------------------------"
