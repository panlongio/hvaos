#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PACKS_ROOT="$REPO_ROOT/packs"
CORE_DIR="$PACKS_ROOT/core/base"

OUT_DIR=""
DOMAIN=""
STACKS=()

usage() {
  cat <<USAGE
Usage: bash scripts/build-template-pack.sh --out <dir> [--domain <name>] [--stack <name> ...]

Examples:
  bash scripts/build-template-pack.sh --out ./dist/hvaos-saas-next --domain saas --stack nextjs --stack supabase
  bash scripts/build-template-pack.sh --out ./dist/hvaos-media --domain media
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --out)
      OUT_DIR="${2:-}"
      shift 2
      ;;
    --domain)
      DOMAIN="${2:-}"
      shift 2
      ;;
    --stack)
      STACKS+=("${2:-}")
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

[[ -n "$OUT_DIR" ]] || { echo "[ERROR] --out is required" >&2; exit 1; }
[[ -d "$CORE_DIR" ]] || { echo "[ERROR] core templates not found: $CORE_DIR" >&2; exit 1; }

mkdir -p "$OUT_DIR"

files=("01-intent.md" "02-rules.md" "03-processes.md" "04-context.md" "05-acceptance.md")

for f in "${files[@]}"; do
  cp "$CORE_DIR/$f" "$OUT_DIR/$f"
done

append_overlay() {
  local overlay_dir="$1"
  local label="$2"
  for f in "${files[@]}"; do
    if [[ -f "$overlay_dir/$f" ]]; then
      {
        echo
        echo "---"
        echo
        echo "<!-- Overlay: $label -->"
        cat "$overlay_dir/$f"
      } >> "$OUT_DIR/$f"
    fi
  done
}

if [[ -n "$DOMAIN" ]]; then
  domain_dir="$PACKS_ROOT/domain-pack/$DOMAIN"
  [[ -d "$domain_dir" ]] || { echo "[ERROR] domain pack not found: $DOMAIN" >&2; exit 1; }
  append_overlay "$domain_dir" "domain/$DOMAIN"
fi

for s in "${STACKS[@]}"; do
  stack_dir="$PACKS_ROOT/stack-pack/$s"
  [[ -d "$stack_dir" ]] || { echo "[ERROR] stack pack not found: $s" >&2; exit 1; }
  append_overlay "$stack_dir" "stack/$s"
done

cat > "$OUT_DIR/PACK-MANIFEST.md" <<MANIFEST
# Generated HvAOS Template Pack

- generated_at: $(date -u +%Y-%m-%dT%H:%M:%SZ)
- core: core/base
- domain: ${DOMAIN:-none}
- stacks: ${STACKS[*]:-none}
MANIFEST

echo "[OK] template pack generated at: $OUT_DIR"
