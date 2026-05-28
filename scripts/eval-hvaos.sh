#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
INSTALL_SCRIPT="$REPO_ROOT/website/install.sh"
VERIFY_SCRIPT="$SCRIPT_DIR/verify-hvaos.sh"
BENCHMARK_SCRIPT="$SCRIPT_DIR/intent-benchmark.sh"
REPORT_DIR="$REPO_ROOT/artifacts"
REPORT_FILE="$REPORT_DIR/eval-report.json"
RUN_BENCHMARK="false"

for arg in "$@"; do
  case "$arg" in
    --with-benchmark)
      RUN_BENCHMARK="true"
      ;;
    *)
      echo "[ERROR] unknown option: $arg" >&2
      echo "Usage: bash scripts/eval-hvaos.sh [--with-benchmark]" >&2
      exit 1
      ;;
  esac
done

[[ -x "$VERIFY_SCRIPT" ]] || { echo "[ERROR] verify script not executable: $VERIFY_SCRIPT" >&2; exit 1; }
[[ -f "$INSTALL_SCRIPT" ]] || { echo "[ERROR] install script missing: $INSTALL_SCRIPT" >&2; exit 1; }
if [[ "$RUN_BENCHMARK" == "true" ]]; then
  [[ -x "$BENCHMARK_SCRIPT" ]] || { echo "[ERROR] benchmark script not executable: $BENCHMARK_SCRIPT" >&2; exit 1; }
fi
mkdir -p "$REPORT_DIR"

run_case() {
  local preset="$1"
  local name="$2"
  local mission="$3"
  local tmpdir
  tmpdir="$(mktemp -d)"

  (
    cd "$tmpdir"
    printf "%s\n%s\n%s\n" "$preset" "$name" "$mission" | bash "$INSTALL_SCRIPT" >/dev/null 2>&1
    bash "$VERIFY_SCRIPT" "$tmpdir" >/dev/null
  )

  rm -rf "$tmpdir"
}

cases=("coding:1:EvalCoding:Build reliable SaaS workflows safely."
       "media:2:EvalMedia:Publish compliant technical media content."
       "life:3:EvalLife:Manage schedule and budget with privacy.")

pass=0
total=${#cases[@]}
started_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

printf '{\n  "started_at": "%s",\n  "cases": [\n' "$started_at" > "$REPORT_FILE"

for i in "${!cases[@]}"; do
  IFS=':' read -r key preset name mission <<< "${cases[$i]}"
  status="failed"
  if run_case "$preset" "$name" "$mission"; then
    pass=$((pass + 1))
    status="passed"
    echo "[OK] ${key} preset passed"
  else
    echo "[FAIL] ${key} preset failed"
  fi

  comma=","
  if [[ "$i" -eq $((total - 1)) ]]; then
    comma=""
  fi
  printf '    {"name":"%s","status":"%s"}%s\n' "$key" "$status" "$comma" >> "$REPORT_FILE"
done

score="$pass/$total"
ended_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

printf '  ],\n  "score": "%s",\n  "pass": %s,\n  "total": %s,\n  "benchmark": {"enabled": %s},\n  "ended_at": "%s"\n}\n' "$score" "$pass" "$total" "$RUN_BENCHMARK" "$ended_at" >> "$REPORT_FILE"

echo "[INFO] score: $score"
echo "[INFO] report: $REPORT_FILE"
if [[ "$pass" -ne "$total" ]]; then
  echo "[ERROR] evaluation failed" >&2
  exit 1
fi

if [[ "$RUN_BENCHMARK" == "true" ]]; then
  bash "$BENCHMARK_SCRIPT"
fi

echo "[OK] all evaluation cases passed"
