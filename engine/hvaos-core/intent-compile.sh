#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
OUT_DIR="$REPO_ROOT/artifacts"
OUT_FILE="$OUT_DIR/intent-runtime.json"

extract_yaml_block() {
  local file="$1"
  awk '
    /^```yaml$/ {in_block=1; next}
    /^```$/ && in_block {exit}
    in_block {print}
  ' "$file"
}

json_escape() {
  sed 's/\\/\\\\/g; s/"/\\"/g'
}

append_pack_metadata() {
  local pack_file="$1"
  local yaml
  yaml="$(extract_yaml_block "$pack_file" | sed 's/^\s\{0,\}$//')"
  local pack_name
  pack_name="$(basename "$(dirname "$pack_file")")"
  local pack_type
  pack_type="$(basename "$(dirname "$(dirname "$pack_file")")")"

  printf '    {"pack_name":"%s","pack_type":"%s","path":"%s","metadata_yaml":"%s"}' \
    "$pack_name" "$pack_type" "${pack_file#$REPO_ROOT/}" "$(printf '%s' "$yaml" | json_escape | tr '\n' '\\n')"
}

mkdir -p "$OUT_DIR"

intent_yaml="$(extract_yaml_block "$REPO_ROOT/packs/core/base/01-intent.md")"
rules_yaml="$(extract_yaml_block "$REPO_ROOT/packs/core/base/02-rules.md")"
acceptance_yaml="$(extract_yaml_block "$REPO_ROOT/packs/core/base/05-acceptance.md")"

pack_files=(
  "$REPO_ROOT/packs/domain-pack/saas/PACK.md"
  "$REPO_ROOT/packs/domain-pack/media/PACK.md"
  "$REPO_ROOT/packs/domain-pack/life/PACK.md"
  "$REPO_ROOT/packs/stack-pack/nextjs/PACK.md"
  "$REPO_ROOT/packs/stack-pack/supabase/PACK.md"
  "$REPO_ROOT/packs/stack-pack/stripe/PACK.md"
)

for f in "${pack_files[@]}"; do
  [[ -f "$f" ]] || { echo "[ERROR] missing pack metadata file: $f" >&2; exit 1; }
done

{
  printf '{\n'
  printf '  "generated_at": "%s",\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  printf '  "runtime_version": "0.1.0",\n'
  printf '  "core_cards": {\n'
  printf '    "intent_spec_yaml": "%s",\n' "$(printf '%s' "$intent_yaml" | json_escape | tr '\n' '\\n')"
  printf '    "runtime_rules_yaml": "%s",\n' "$(printf '%s' "$rules_yaml" | json_escape | tr '\n' '\\n')"
  printf '    "acceptance_assertions_yaml": "%s"\n' "$(printf '%s' "$acceptance_yaml" | json_escape | tr '\n' '\\n')"
  printf '  },\n'
  printf '  "packs": [\n'

  for i in "${!pack_files[@]}"; do
    append_pack_metadata "${pack_files[$i]}"
    if [[ "$i" -lt $((${#pack_files[@]} - 1)) ]]; then
      printf ','
    fi
    printf '\n'
  done

  printf '  ]\n'
  printf '}\n'
} > "$OUT_FILE"

echo "[OK] intent runtime compiled: $OUT_FILE"

# 动态调用 hvaos-cli 物理整合双层 rules/memory 并分发到 IDE 的规则芯片目录中
echo "[INFO] Invoking hvaos-cli compile..."
python3 "$REPO_ROOT/scripts/hvaos-cli.py" compile
python3 "$REPO_ROOT/scripts/hvaos-cli.py" merge-memories

