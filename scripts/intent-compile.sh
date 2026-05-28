#!/usr/bin/env bash
# scripts/intent-compile.sh
# 向后兼容包装器：将所有参数透明转发给 engine/hvaos-core/ 引擎内核

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bash "$SCRIPT_DIR/../engine/hvaos-core/intent-compile.sh" "$@"
