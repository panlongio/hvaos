#!/usr/bin/env bash
# scripts/build-install-vsix.sh
# 自动编译打包并将 HvAOS 卡槽插件安装到 VS Code 中

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VS_EXT_DIR="$REPO_ROOT/sockets/vscode-extension"

echo "[HvAOS Socket Builder] Ready to package VS Code rule socket extension..."

cd "$VS_EXT_DIR"

# 1. 检查 node & npm
command -v npm >/dev/null 2>&1 || { echo "[ERROR] npm is required to package the extension." >&2; exit 1; }

# 2. 打包生成 .vsix
echo "[HvAOS Socket Builder] Building vsix package..."
# 静态声明为 0.1.0 稳定版
npx -y @vscode/vsce package --no-yarn -o "hvaos-vscode-0.1.0.vsix"

# 3. 检查 code 是否存在 (VS Code 命令行工具)
if command -v code >/dev/null 2>&1; then
  echo "[HvAOS Socket Builder] VS Code CLI 'code' detected. Installing extension..."
  code --install-extension "hvaos-vscode-0.1.0.vsix"
  echo "[HvAOS Socket Builder] [SUCCESS] hvaos-vscode installed successfully into your VS Code!"
else
  echo ""
  echo "[HvAOS Socket Builder] [WARNING] VS Code command line tool 'code' is not in PATH."
  echo "[HvAOS Socket Builder] [HINT] Please manually install the generated package: $VS_EXT_DIR/hvaos-vscode-0.1.0.vsix"
  echo ""
fi
