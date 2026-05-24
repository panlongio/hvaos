#!/usr/bin/env bash
set -euo pipefail

ALLOW_PLACEHOLDERS="false"
ROOT_DIR="."

for arg in "$@"; do
  case "$arg" in
    --allow-placeholders)
      ALLOW_PLACEHOLDERS="true"
      ;;
    *)
      ROOT_DIR="$arg"
      ;;
  esac
done

cd "$ROOT_DIR"

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

fail() {
  echo "[ERROR] $1" >&2
  exit 1
}

echo "[INFO] Running HvAOS verification in: $(pwd)"

for file in "${REQUIRED_MD_FILES[@]}"; do
  [[ -f "$file" ]] || fail "Missing required file: $file"
done

for file in "${REQUIRED_MDC_FILES[@]}"; do
  [[ -f "$file" ]] || fail "Missing required chip: $file"
done

if [[ "$ALLOW_PLACEHOLDERS" != "true" ]]; then
  if rg -n '\{\{[^}]+\}\}' "${REQUIRED_MD_FILES[@]}" >/dev/null; then
    echo "[ERROR] Unresolved placeholders found in core markdown files:"
    rg -n '\{\{[^}]+\}\}' "${REQUIRED_MD_FILES[@]}"
    exit 1
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
