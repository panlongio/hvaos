#!/bin/bash
set -e

# Immersive Neon ANSI Colors
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
PURPLE='\033[0;35m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

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

# Target directory validation
CURRENT_DIR=$(pwd)
PROJECT_DEFAULT_NAME=$(basename "$CURRENT_DIR")

echo -e "📍 目标安装目录: ${GREEN}$CURRENT_DIR${NC}"
echo -e "🚀 准备在此项目中激活 HvAOS 行为阻断网关..."
echo ""

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
        DEFAULT_MISSION="To build a modular SaaS backend with strict TypeScript and 100% test coverage."
        ;;
esac

echo -e "已选择: ${GREEN}$PRESET_NAME Presets${NC}"
echo ""

# Interactive prompts for Project variables
read -p "请输入项目名称 (Project Name) [$PROJECT_DEFAULT_NAME]: " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-$PROJECT_DEFAULT_NAME}

read -p "请输入项目核心使命 (Project Mission) [$DEFAULT_MISSION]: " PROJECT_MISSION
PROJECT_MISSION=${PROJECT_MISSION:-$DEFAULT_MISSION}

# Clean folder and create target tree
echo -e "\n🧹 正在生成本地目录结构..."
mkdir -p .hvaos

# Setup Github Raw Assets Base URL
RAW_BASE_URL="https://raw.githubusercontent.com/panlongio/hvaos/main"
FILES=("01-intent" "02-rules" "03-processes" "04-context" "05-acceptance")

for file in "${FILES[@]}"; do
    echo -e "📥 正在下载 ${CYAN}${file}.md${NC} 模板并填入个性化参数..."
    
    # Download matching presets raw content
    TEMP_FILE=$(mktemp)
    curl -s "${RAW_BASE_URL}/presets/${PRESET_KEY}/${file}.md" > "$TEMP_FILE"
    
    # Replace instance strings
    sed -i '' "s/AcmeSaaS/${PROJECT_NAME}/g" "$TEMP_FILE" 2>/dev/null || sed -i "s/AcmeSaaS/${PROJECT_NAME}/g" "$TEMP_FILE"
    sed -i '' "s/TechDaily/${PROJECT_NAME}/g" "$TEMP_FILE" 2>/dev/null || sed -i "s/TechDaily/${PROJECT_NAME}/g" "$TEMP_FILE"
    sed -i '' "s/LifeOps/${PROJECT_NAME}/g" "$TEMP_FILE" 2>/dev/null || sed -i "s/LifeOps/${PROJECT_NAME}/g" "$TEMP_FILE"
    
    sed -i '' "s|To build a highly reliable, performant, and secure cloud platform that automates workflows for remote teams, solving the latency and collaboration fragmentation pain points.|${PROJECT_MISSION}|g" "$TEMP_FILE" 2>/dev/null || sed -i "s|To build a highly reliable, performant, and secure cloud platform that automates workflows for remote teams, solving the latency and collaboration fragmentation pain points.|${PROJECT_MISSION}|g" "$TEMP_FILE"
    sed -i '' "s|To democratize complex AI and software engineering concepts through engaging, jargon-free, and visually structured articles, helping tech practitioners and enthusiasts stay ahead without feeling overwhelmed.|${PROJECT_MISSION}|g" "$TEMP_FILE" 2>/dev/null || sed -i "s|To democratize complex AI and software engineering concepts through engaging, jargon-free, and visually structured articles, helping tech practitioners and enthusiasts stay ahead without feeling overwhelmed.|${PROJECT_MISSION}|g" "$TEMP_FILE"
    sed -i '' "s|To build a balanced, stress-free lifestyle system that optimizes daily focus, preserves physical health, and maintains financial freedom, helping independent builders achieve their goals without burn-out.|${PROJECT_MISSION}|g" "$TEMP_FILE" 2>/dev/null || sed -i "s|To build a balanced, stress-free lifestyle system that optimizes daily focus, preserves physical health, and maintains financial freedom, helping independent builders achieve their goals without burn-out.|${PROJECT_MISSION}|g" "$TEMP_FILE"
    
    # Move out of temp into target root
    mv "$TEMP_FILE" "${file}.md"
    
    # Create matching MDC chips in .hvaos/
    echo -e "🛡️ 正在生成并链接芯片 ${PURPLE}.hvaos/${file}.mdc${NC}..."
    cat <<EOF > ".hvaos/${file}.mdc"
---
description: Rule alignment for ${file} in ${PROJECT_NAME}
globs: *
---
# ${file} MDC chip template
Please align all operations with the definitions located in the root-level ${file}.md config.
EOF
done

# Download and generate README-HvAOS.md instruction file
echo -e "📥 正在下载 ${CYAN}README-HvAOS.md${NC} 使用说明书并配置引导协议..."
TEMP_README=$(mktemp)
curl -s "${RAW_BASE_URL}/README-HvAOS.md" > "$TEMP_README"
mv "$TEMP_README" "README-HvAOS.md"


# Auto-detect IDE environment from parent processes
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
        # Standard VS Code (used by extensions like Cline/Roo Code)
        DETECTED_IDE="cursor"
        break
    fi
done

# Fallback check using environment variables
if [ -z "$DETECTED_IDE" ]; then
    if [ "$TERM_PROGRAM" = "vscode" ] || [ -n "$VSCODE_GIT_IPC_HANDLE" ]; then
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

# Success Declaration
echo -e "\n${GREEN}✨ [SUCCESS] HvAOS 规则芯片已全部装载完成！${NC}"
echo -e "💡 已经自动在当前项目根目录下生成了 5 层规则文档、\`.hvaos/\` 核心规则目录以及 \`README-HvAOS.md\` 说明书${LINK_INFO}。"
echo -e "-------------------------------------------------------------"
echo -e "\n📢 [AI ASSISTANT ACTION REQUIRED] 🚀"
echo -e "请 AI 助手立即读取项目根目录下的 \`README-HvAOS.md\` 文件，并执行其中的【AI 智能启动与初始化协议】，自动启动与人类的问答交互！"
echo -e "-------------------------------------------------------------"

