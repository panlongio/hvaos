# HvAOS (Human vs AI OS) — 人机协作与意图对齐网关使用指南

> [!NOTE]
> **HvAOS** 是一个极简、领域无关的 AI 协同协议与规则自演进系统。
> **HvA (Human vs AI)** 代表人机双向博弈与意图对齐。它通过 5 层逻辑解耦卡片与自演进设计，解决 AI 协作中的**规则负债 (Rule Debt)**、**注意力稀释 (Attention Dilution)** 与**维护惰性 (Maintenance Inertia)** 痛点，实现开箱即用的自动化意图对齐与规则装载。


---

## 👨‍💻 人类（您）使用说明

*   **安装模式**：
    - 默认本地稳定模式：`bash website/install.sh`
    - 远程模式（可选）：`bash website/install.sh --remote --ref <git-ref>`
    - 远程模式会校验 `website/checksums.txt` 里的 SHA256。
*   **一键自动启动**：如果您是通过运行 `install.sh` 脚本一键装载的，**AI 助手在安装完成后会自动读取协议并向您发起提问**，您只需直接在聊天框中回答即可！
*   **手动启动（备用 / ZIP下载用户）**：如果您是通过官网下载 ZIP 解压的，或者您的 AI 助手没有自动发起提问，请复制并向 AI 发送以下指令以手动激活：
    > “请读取项目里的 `README-HvAOS.md` 文件，并执行其中的【AI 智能启动与初始化协议】。”
*   **回答**：无论何种方式启动后，AI 都会为您整理出一份极简的定制问题（一般不超过 5 个）。您只需简单回答，AI 就会自动补齐所有场景占位符并激活规则卡片！

---

## 🤖 AI Bootloader Protocol (AI 智能启动与初始化协议)

> [!IMPORTANT]
> **AI 助手请注意：当你收到人类要求初始化本协议的指令时，你必须严格按照以下步骤执行：**

### 1. 扫描与分析阶段
1. 依次读取同级目录下的 5 个文档：
   - `01-intent.md`（意图层）
   - `02-rules.md`（规则层）
   - `03-processes.md`（流程层）
   - `04-context.md`（上下文层）
   - `05-acceptance.md`（验收层）
2. 识别出这些文档中所有的 `{{PLACEHOLDERS}}`（双大括号包裹的占位符）以及注释中提示需要补充的空白字段。

### 2. 问卷整理与交互阶段
1. 在对话中，向人类输出一份**极简、友好且结构化**的提问清单。
2. **提问原则**：
   - 每次提问数量控制在 5 个以内，避免让人类感到疲劳。
   - 尽量提供**多选题 (Recommended)** 或 **简答题** 的形式，降低人类的输入成本。
   - **核心问题**：询问当前项目是属于 **【自媒体运营/内容生产】**、**【个人生活/助理管理】** 还是 **【软件开发】**，以便激活对应的规则插槽。

### 3. 文档自动填充与芯片装载阶段
1. 获得人类的回答后，自动用真实内容替换 5 个 Markdown 文档中的占位符，保存文件。
2. **装载规则芯片 (.mdc)**：
   > [!NOTE]
   > **「规则芯片」概念澄清**：这里的“芯片”为**纯软件层面的配置规则文件**（如 `.mdc` 等），**无需任何物理硬件支持**。除了支持 IDE 的被动拦截，本协议亦完全兼容命令行终端（如 Claude Code, Aider）及自定义 Agent 框架。
   - 将 `.hvaos/` 目录下对应的 5 个规则卡片（如 `01-intent.mdc`）用人类的回答替换卡片中的占位符。
   - **如果项目涉及代码开发或需要激活 IDE 规则拦截机制**，在终端中执行以下符号链接指令，为 IDE（如 Cursor 等）激活规则卡片：
     ```bash
     mkdir -p .cursor && ln -sf ../.hvaos .cursor/rules
     ```
   - **若运行在无 native MDC 规则卡片解析的纯命令行 AI 环境（如 Claude Code、Aider）或自定义 Agent 框架下**：AI 助手必须将本目录下的 5 份 Markdown 规则文档（01-intent 至 05-acceptance）作为全局静态 System Instructions/System Prompt 读入当前 Session，尽可能保持规则对齐。
   - **若运行在 OpenClaw、Hermes 等全局个人助理 Agent 框架下 (常驻网关自适应热加载)**：
      为防止规则因“动态 Skill 按需检索”被绕过，或“硬编码注入”造成日常闲聊污染，请将以下 **【HvAOS 智能体常驻网关元指令 (System Gateway Instructions)】** 复制并追加到您的 Agent 全局 System Prompt / Soul 配置文件中（例如 OpenClaw 的 `~/.openclaw/agents/<agent-name>/agent.md` 或 `soul.md`，或 Hermes 的角色 Base Prompt 模板）：

      > **[HvAOS System Gateway Daemon Instructions]**
      >
      > *   **Role**: You are a personal assistant equipped with the HvAOS (Human-v-Agent OS) Alignment Gateway.
      > *   **Mode 1: Idle (Casual Conversation)**: If the user is engaging in casual, non-project conversations (e.g. general Q&A, greetings), remain casual and friendly. Do not invoke any workflow guardrails.
      > *   **Mode 2: Active (Project-oriented Tasks)**: If the user initiates a concrete project-oriented task (e.g., coding, writing articles, planning budgets, managing files):
      >     1.  **Detect**: Immediately check the active workspace/project directory for the existence of `.hvaos/` rules directory.
      >     2.  **Mount**: If `.hvaos/` exists, run file tools to read all 5 alignment cards (`01-intent.md` to `05-acceptance.md`) in that directory. Treat them as absolute runtime system instructions for the current session.
      >     3.  **Enforce**: Rigidly enforce the **Spec Gate** (ask for user approval before making file changes) and **DoD Checklist** (run verification gates before delivery) specified in the loaded cards.
      >     4.  **Auto-evolving**: Execute self-evolution protocols to update `04-context.md` (keep it capped at 5 critical warnings) upon task completion.

3. **完成宣告**：以精简的形式告知人类项目初始化已完成，并列出当前已激活的 5 层规则与运行命令。
