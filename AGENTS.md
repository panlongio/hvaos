# hvaos Agent Entry

本文件是所有 AI 编程工具（Gemini CLI, Claude Code, Codex, Cursor 等）在本仓库的统一入口。

## Required Reads (必须阅读)

在开展任何任务开发或系统研究前，AI 必须按顺序读取：

1. [README.md](file:///Users/panlong/Documents/code/spase/hvaos/README.md) — 了解项目基本运行与本地调试命令。
2. `.agent/rules/` — AI 专属的五张核心规则卡片（已通过软链接同步至 `.cursor/rules/`）：
   - [01-intent.mdc](file:///Users/panlong/Documents/code/spase/hvaos/.agent/rules/01-intent.mdc) (意图层 — 产品定位与反向边界)
   - [02-rules.mdc](file:///Users/panlong/Documents/code/spase/hvaos/.agent/rules/02-rules.mdc) (规则层 — 开发、UI视觉与数据库红线)
   - [03-processes.mdc](file:///Users/panlong/Documents/code/spase/hvaos/.agent/rules/03-processes.mdc) (流程层 — 任务标准周期)
   - [04-context.mdc](file:///Users/panlong/Documents/code/spase/hvaos/.agent/rules/04-context.mdc) (上下文层 — 技术栈与技术债)
   - [05-acceptance.mdc](file:///Users/panlong/Documents/code/spase/hvaos/.agent/rules/05-acceptance.mdc) (验收层 — 硬性自检与交付标准)

## Mandatory Redlines (核心红线)

- **方案先行**：用户未在聊天中明确输入“同意”或“继续”，不得执行任何文件修改或代码写入。
- **决策推荐**：面临多个技术设计选择时，必须明确推荐最优方案并详述理由，严禁让用户做单选题。
- **二阶思维**：绝对禁止机械顺从，必须深度分析用户提议的二阶影响（连锁反应、系统变动、商业模式），并从产品体验 (UI/UX) 与商业化层面主动给出具有前瞻性的优化与增值建议。
- **凭证安全**：绝对禁止提交或泄露任何密钥、凭证、敏感配置或 `.env` 环境变量文件。
