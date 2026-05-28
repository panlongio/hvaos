#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKS_DIR="$ROOT_DIR/packs"

required=("01-intent.md" "02-rules.md" "03-processes.md" "04-context.md" "05-acceptance.md")

for f in "${required[@]}"; do
  [[ -f "$PACKS_DIR/core/base/$f" ]] || { echo "[ERROR] missing core template: $f"; exit 1; }
done

for p in "$PACKS_DIR/domain-pack"/* "$PACKS_DIR/stack-pack"/*; do
  [[ -d "$p" ]] || continue
  [[ -f "$p/PACK.md" ]] || { echo "[ERROR] missing PACK.md in $p"; exit 1; }
done

echo "[OK] pack structure verified"
