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
mkdir -p .agent/rules

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
    
    # Create matching MDC chips in .agent/rules/
    echo -e "🛡️ 正在生成并链接芯片 ${PURPLE}.agent/rules/${file}.mdc${NC}..."
    cat <<EOF > ".agent/rules/${file}.mdc"
---
description: Rule alignment for ${file} in ${PROJECT_NAME}
globs: *
---
# ${file} MDC chip template
Please align all operations with the definitions located in the root-level ${file}.md config.
EOF
done

# Perform IDE rules symbolic link setup
echo -e "\n🔗 正在与 IDE 建立芯片关联通道 (Linking to .cursor/rules)..."
mkdir -p .cursor
ln -sf ../.agent/rules .cursor/rules

# Success Declaration
echo -e "\n${GREEN}✨ [SUCCESS] HvAOS 规则芯片已全部装载完成！${NC}"
echo -e "💡 已经自动在当前项目根目录下生成了 5 层规则文档及 \`.cursor/rules\` 的软链接芯片。"
echo -e "🤖 下次您在此项目唤醒 AI（如 Cursor/Claude Code）时，规则将强制开始拦截生效。"
echo -e "-------------------------------------------------------------"
