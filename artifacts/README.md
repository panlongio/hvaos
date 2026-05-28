# HvAOS Artifacts Reports

本目录用于存放 HvAOS 的可追溯评测产物，支持“结构校验 + 安装回归 + 意图效果”三层证据链。

## 报告清单

- `eval-report.json`
  - 来源：`bash scripts/eval-hvaos.sh`
  - 用途：验证 coding/media/life 安装与基础回归是否通过。

- `intent-runtime.json`
  - 来源：`bash scripts/intent-compile.sh`
  - 用途：将 5 张卡与 pack 元数据编译为标准化运行时配置。

- `intent-benchmark-report.json`
  - 来源：`bash scripts/intent-benchmark.sh`
  - 用途：同模型版本下对比 baseline vs hvaos 的效果增益。

## 指标定义

- `FPSR` (First-Pass Success Rate)
  - 定义：一次交付通过任务数 / 总任务数。

- `Rework Rate`
  - 定义：需要二次返工任务数 / 总任务数。

- `Intent Deviation Count`
  - 定义：任务执行中偏离原始意图的事件总数。

- `Correction Success Rate`
  - 定义：成功纠偏次数 / 总偏差次数。

- `FPSR uplift`
  - 定义：`(FPSR_hvaos - FPSR_baseline) / FPSR_baseline`。
  - V1 门槛：`>= 0.20`。

## 发布门禁建议

发布前至少执行：

```bash
bash scripts/verify-packs.sh
bash scripts/verify-hvaos.sh --allow-placeholders .
bash scripts/eval-hvaos.sh --with-benchmark
```

若 `intent-benchmark-report.json` 中 `meets_target=false`，仅允许内部迭代，不对外宣称“效果已验证”。
