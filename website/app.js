// Presets Data for the Sandbox Console
const presetsData = {
    coding: {
        title: "Coding Mode (💻 软件开发)",
        code: `<span class="comment"># HvAOS - 💻 软件开发规则预设 (.hvaos/02-rules.mdc)</span>

<span class="key">- 核心开发红线 (Redlines):</span>
  1. 未在对话中明确获得人类输入 <span class="string">"同意"</span> 或 <span class="string">"继续"</span> 前，禁止修改任何代码或文件。
  2. <span class="accent">【绝对禁令】</span> 严禁将任何密码、API 密钥、Token 或 .env 配置文件提交到代码库。
  
<span class="key">- 手术刀精准修改 (Precision Coding):</span>
  1. 遵循最小改动原则，精准修复，绝不为修改局部问题而大范围重写邻近代码。
  2. 保持原有注释和文档的完整性，新增代码必须附带英文注释。

<span class="key">- 质量预检门禁 (Quality Gates):</span>
  1. 逻辑修改后，必须在本地运行 <span class="string">"npm run check"</span> / <span class="string">"npm run test"</span>。
  2. 提交代码时，Git 提交信息必须以语义化前缀规范开头 (例如: <span class="string">"feat: xxxx"</span>, <span class="string">"fix: xxxx"</span>).`
    },
    media: {
        title: "Media Mode (✍️ 自媒体写稿)",
        code: `<span class="comment"># HvAOS - ✍️ 自媒体与内容运营预设 (.hvaos/02-rules.mdc)</span>

<span class="key">- 核心内容红线 (Redlines):</span>
  1. 内容中严禁出现 any 未经证实的谣言，严禁搬运或抄袭未授权的内容。
  2. <span class="accent">【绝对禁令】</span> 严禁直接使用含有商业版权版权纠纷的图片、字体或音视频素材。

<span class="key">- 文风与排版约束 (Style & Copywriting):</span>
  1. 避免使用互联网废话与过度渲染的词汇（如: 史诗级、颠覆性、彻底改变等）。
  2. 标题排版与正文过渡必须符合 <span class="string">"痛点引入 -> 深度剖析 -> 解决方案 -> 互动金句"</span> 结构。

<span class="key">- 质量审核门槛 (Acceptance Check):</span>
  1. 在最终成稿前，必须通过本地**敏感词/违禁词过滤**检测。
  2. 排版字数需精确控制在 <span class="string">"1,200 字 ~ 2,000 字"</span> 之间，段落留白合理，适合手机端阅读。`
    },
    life: {
        title: "Life Mode (📅 个人助理与生活理财)",
        code: `<span class="comment"># HvAOS - 📅 个人助理/生活理财规则预设 (.hvaos/02-rules.mdc)</span>

<span class="key">- 核心隐私红线 (Redlines):</span>
  1. <span class="accent">【绝对禁令】</span> 严禁向任何大模型明文暴露银行卡密码、社保号、真实家庭住址等绝对隐私。
  2. AI 整理的账单或规划中涉及个人财务时，必须对卡号和金额进行掩码处理：<span class="string">"6225****8888"</span>。

<span class="key">- 预算管控红线 (Budget Control):</span>
  1. 记账表格整理时，公式单元格必须保持只读，禁止改写或硬编码计算结果。
  2. 月度支出如超过预算的 <span class="string">"90%"</span>，AI 必须立刻中断当前执行，向人类发送红色预警弹窗。

<span class="key">- 任务流跟踪 (Processes):</span>
  1. 收集账单流水 -> 对比银行余额 -> 生成月度财务分析图表 -> 检查预算超支状态。`
    }
};

// Generator Options Configuration
const generatorConfig = {
    coding: {
        defaultMission: "To build a highly reliable SaaS workflow engine for global remote teams.",
        rules: [
            { id: "rule-spec-gate", text: "【方案先行】文件修改前必须在对话中获得用户确认", checked: true, detail: "Before modifying any file, AI must present a detailed implementation plan in chat." },
            { id: "rule-key-protect", text: "【凭证安全】严禁提交任何 API 密钥、Token 或明文配置", checked: true, detail: "Strictly forbid hardcoding passwords, keys, or .env files in code repositories." },
            { id: "rule-precision-edit", text: "【手术刀修改】遵循最小改动原则，精准局部修复", checked: true, detail: "Follow the principle of least modification. Only touch relevant code blocks." },
            { id: "rule-strict-typescript", text: "【严格TS类型】严禁使用 any 或编译器跳过逃避检查", checked: true, detail: "Strict TypeScript rules apply. Avoid escaping static type checks." },
            { id: "rule-vanilla-css", text: "【原生美工】使用 Vanilla CSS 保持精美微动效且零占位图", checked: false, detail: "Use standard CSS variables and avoid layout placeholder blocks." }
        ]
    },
    media: {
        defaultMission: "To produce high-quality, readable articles on tech topics for software engineers.",
        rules: [
            { id: "rule-outline-first", text: "【大纲先行】成稿前必须先提交文章大纲结构获批", checked: true, detail: "AI must submit a structure outline (hook, headers, CTA) before writing." },
            { id: "rule-no-plagiarism", text: "【版权守护】禁止抄袭与洗稿，引用案例说明出处", checked: true, detail: "Do not scrape copyright materials. Always credit external case studies." },
            { id: "rule-conversational", text: "【金句调性】使用幽默直接、有干货的自媒体写作风格", checked: true, detail: "Witty, jargon-free conversational tone. Keep paragraphs under 4 lines." },
            { id: "rule-word-limit", text: "【篇幅约束】微信/小红书篇幅严控在合适阅读字数内", checked: false, detail: "Control length between 800 - 1800 words. Format with bold logical anchors." },
            { id: "rule-banned-words", text: "【违禁检测】发布前自动筛查平台敏感词与硬广告用语", checked: false, detail: "Run automated filters to eliminate absolute superlative claims." }
        ]
    },
    life: {
        defaultMission: "To manage daily focus, sleep quality, and monthly savings budgets.",
        rules: [
            { id: "rule-plan-gate", text: "【排期确认】重大日历变动、出游订票前须获得批准", checked: true, detail: "Confirm major schedule shifts or subscriptions before updating." },
            { id: "rule-privacy-mask", text: "【隐私脱敏】整理账单或出行信息对核心数字打星号", checked: true, detail: "Auto-mask card numbers, phone numbers, and identity strings." },
            { id: "rule-budget-cap", text: "【预算超限】月度总额支出超 90% 触发红色拦截提示", checked: true, detail: "Discretionary budget cap at 90% utilization triggers absolute alarm." },
            { id: "rule-winddown-lock", text: "【作息保障】晚 9:30 至早 7:00 锁定，禁止插入工作", checked: false, detail: "Do not schedule deep-work focus sessions during the wind-down window." },
            { id: "rule-exercise-lock", text: "【健康门槛】锁定每周三次健身时段，禁止被日程覆盖", checked: false, detail: "Mon/Wed/Fri exercise slots are read-only and cannot be overwritten." }
        ]
    }
};

// Markdown Templates Builder
function generateMarkdownTemplates(projectName, projectMission, presetKey, activeRules) {
    const rulesDetailText = activeRules.map((r, i) => `  ${i + 1}. [Rule] ${r.text}\n     - Detail: ${r.detail}`).join("\n");
    
    const templates = {};
    
    // 01-intent.md
    templates["01-intent.md"] = `# 01 - Intent Document (What We Want)

This document defines the core direction and ultimate goals of the ${projectName} project. The AI assistant must align all designs and actions with these goals.

---

## 1. Project Overview

*   **Project Name**: \`${projectName}\`
*   **Core Mission (Why)**: \`${projectMission}\`

---

## 2. Target Audience & Core Value

*   **Target Audience**:
    - Users facing pain points related to ${presetKey === 'coding' ? 'software engineering and SaaS workflows' : presetKey === 'media' ? 'content distribution and technical writing' : 'personal schedules and financial planning'}.
*   **Core Pain Point**:
    - Lack of clear structure, coordination friction, or excessive administrative overhead.

---

## 3. Project Boundaries

### 🟢 Core Features & Differentiators
1. High-fidelity implementation aligning with human objectives.
2. Immersive user experience with modular design patterns.

### 🔴 Anti-Goals (What We Will NEVER Do)
*   Do NOT bypass human approval gates under any circumstances.
*   Never submit temporary placeholders or unverified data in final deliveries.

---

## 4. Success Metrics

- Deliveries compile/run with zero warnings or fatal errors.
- Action items are fully documented and marked complete.
`;

    // 02-rules.md
    templates["02-rules.md"] = `# 02 - Rules Document (Redlines & Constraints)

This document establishes the strict redlines and constraints for the ${projectName} environment. Any actions violating these guidelines will be rejected.

---

## 1. Universal Redlines

- **Spec Gate Protocol**: AI must present a detailed implementation plan and receive explicit approval from the user before executing substantial modifications.
- **Decision Recommendation**: AI must recommend the optimal solution and explain why, rather than offering a simple list of options.
- **Surgical Execution**: Follow the least modification principle. Only modify lines directly relevant to the current task.
- **Rules Self-Maintenance & Anti-Bloat**: During the task delivery phase, if the project technical stack or business direction changes, the AI must proactively notify the user and update \`01-intent.md\` and \`04-context.md\`. To prevent rule bloat, when updating \`04-context.md\`, keep at most 5 of the most critical warning items per list. AI is strictly forbidden from modifying this file (\`02-rules.md\`) without explicit human approval via the Spec Gate.

---

## 2. Active Rule Modules

Below are the customized rules activated for this workspace:

${rulesDetailText || '  (No additional rules selected)'}
`;

    // 03-processes.md
    templates["03-processes.md"] = `# 03 - Processes Document (Workflows & Pipelines)

This document outlines the standard lifecycle. The AI assistant must follow these processes sequentially.

---

## 1. Standard Task Lifecycle

1. **Requirement Analysis**: Inspect relevant logs, context files, and structures.
2. **Technical Design**: Propose a step-by-step implementation plan.
3. **Spec Gate Approval**: Wait for the user to reply with "consent" or "continue".
4. **Surgical Execution**: Perform minimal modifications, updating task.md.
5. **Quality Verification**: Verify code, run linters, or check copywriting structures.
6. **Delivery Walkthrough & Self-Evolution**: Document the exact changes. If the task involved a tech stack migration, dependency shift, or new retrospective warning, the primary AI must automatically update and prune \`04-context.md\` to keep the documentation aligned.

---

## 2. Distribution & Publishing

- **Cleanup**: Delete mock data, temporary files, and caching logs before staging.
- **Check**: Perform a final compile or readability test.
- **Release**: Sync to production or target channels.

---

## 3. AI Engine Operations (AI 助理运行规范)

- **Multi-Agent Concurrency Lock**: In a multi-agent environment, only the primary Orchestrator Agent has write permissions to modify the 5-layer files in \`.hvaos\` (or root directory). Subagents must operate in read-only mode to prevent write conflicts and inconsistent updates.
- **Walkthrough, Delivery & Self-Evolution**: During the task delivery/walkthrough phase, if the task involved a tech stack migration, dependency shift, or new retrospective warning, the primary AI must automatically update and prune \`04-context.md\` (warnings list capped at 5 items) to keep the documentation aligned.
- **Periodic Memory Heartbeat**: If the chat conversation exceeds 10 turns, the AI must prepend a bold, 1-line recap of active constraints (e.g. \`[Active Redline: Spec Gate Approval Required]\`) at the top of subsequent responses to refocus the LLM's attention in long contexts.
`;

    // 04-context.md
    templates["04-context.md"] = `# 04 - Context Document (System State & Historical Debts)

This document tracks active tools, technical debts, and past experiments.

---

## 1. Active Tools & Setup

> [!IMPORTANT]
> **Local Environment Variable Isolation**: Never hardcode local file paths, credentials, tokens, or local machine-specific configurations inside this file. When defining environmental differences, use env variables (e.g. \`DB_URL=env.DB_URL\`) and load the real value from a local \`.env\` file to prevent exposing sensitive keys or causing Git merge conflicts for the team.

*   **Project Environment**: \`${presetKey === 'coding' ? 'Software development environment' : presetKey === 'media' ? 'Technical copywriting editor' : 'Life planner tracker'}\`
*   **Host Platform**: \`Local system / active git repository\`

---

## 2. Pending Debts & Optimizations

- **Structure Regularization**: Ensure all modules align with the 5-layer HvAOS layout.
- **History Logging**: Track daily execution changes.

---

## 3. Retrospective Warnings (Avoid Repeating Mistakes)

*   **Warning 1**: Avoid automated bulk generation without granular human outlines, which leads to structural distortion.
*   **Warning 2**: Do not ignore buffer periods between sequential task batches.
`;


    // 05-acceptance.md
    templates["05-acceptance.md"] = `# 05 - Acceptance Document (Quality Gates & UX Standards)

This document is the quality checkpoint. No delivery is accepted if it fails any of these criteria.

---

## 1. Automated Pre-checks & Gates

- **Linting & Check**: All static compilations or readability syntax checks must pass with zero issues.
- **Link Auditing**: All external links and file paths referenced must resolve.

---

## 2. UX & Structural Standards

*   **Formatting Harmony**: Keep headers structured and avoid long blocks of information.
*   **Responsive Flow**: Verify structural readability on multiple screen widths.

---

## 3. Negative Gatekeeper

> [!CAUTION]
> **If any of the following flaws exist in the draft, it will be rejected and sent back:**
> 
- Unmasked credentials, private keys, or raw API URLs.
- Incomplete sections or empty placeholders.
`;

    // README-HvAOS.md
    templates["README-HvAOS.md"] = `# HvAOS (Human vs AI OS) — 人机协作与意图对齐网关使用指南

> **HvAOS** 是一个极简、领域无关的 AI 协同协议与规则自演进系统。
> **HvA (Human vs AI)** 代表人机双向博弈与意图对齐。它通过 5 层逻辑解耦卡片与自演进设计，解决 AI 协作中的**规则负债 (Rule Debt)**、**注意力稀释 (Attention Dilution)** 与**维护惰性 (Maintenance Inertia)** 痛点，实现开箱即用的自动化意图对齐与规则装载。
> **个人数字分身资产 (Digital Twin Asset)**：随着项目演进，这 5 份卡片会逐步吸收并沉淀为最贴合您个人风格与偏好的**专属数字分身资产**。开启新项目时，只需一键复用该配置，AI 助手将瞬间继承您积累多年的工程品位，实现无缝对齐。

---

## 👨‍💻 人类（您）使用说明

*   **安装模式**：
    - 默认本地稳定模式：\`bash website/install.sh\`
    - 远程模式（可选）：\`bash website/install.sh --remote --ref <git-ref>\`
    - 远程模式会校验 \`website/checksums.txt\` 里的 SHA256。
*   **一键自动启动**：如果您是通过运行 \`install.sh\` 脚本一键装载的，**AI 助手在安装完成后会自动读取协议并向您发起提问**，您只需直接在聊天框中回答即可！
*   **手动启动（备用 / ZIP下载用户）**：如果您是通过官网下载 ZIP 解压的，或者您的 AI 助手没有自动发起提问，请复制并向 AI 发送以下指令以手动激活：
    > “请读取项目里的 \`README-HvAOS.md\` 文件，并执行其中的【AI 智能启动与初始化协议】。”
*   **回答**：无论何种方式启动后，AI 都会为您整理出一份极简的定制问题（一般不超过 5 个）。您只需简单回答，AI 就会自动补齐所有场景占位符并激活规则卡片！
*   **验收**：初始化完成后，运行 \`bash scripts/verify-hvaos.sh\`，确认规则文件完整且不存在未替换占位符。
*   **回归评测**：运行 \`bash scripts/eval-hvaos.sh\`，确认三种 preset（coding/media/life）端到端安装与验收流程均通过。
*   **模板仓库自检**：若你在检查 HvAOS 模板仓库本身（包含占位符是预期行为），请使用 \`bash scripts/verify-hvaos.sh --allow-placeholders .\`。

---

## 🤖 AI Bootloader Protocol (AI 智能启动与初始化协议)

> [!IMPORTANT]
> **AI 助手请注意：当你收到人类要求初始化本协议的指令时，你必须严格按照以下步骤执行：**

### 1. 扫描与分析阶段
1. 依次读取同级目录下的 5 个文档：
   - \`01-intent.md\`（意图层）
   - \`02-rules.md\`（规则层）
   - \`03-processes.md\`（流程层）
   - \`04-context.md\`（上下文层）
   - \`05-acceptance.md\`（验收层）
2. 识别出这些文档中所有的 \`{{PLACEHOLDERS}}\`（双大括号包裹的占位符）以及注释中提示需要补充的空白字段。

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
   > **「规则芯片」概念澄清说明**：这里的“芯片”为**纯软件层面的配置规则文件**（如 \`.mdc\` 等），**无需任何物理硬件支持**。除了支持 IDE 的被动拦截，本协议亦完全兼容命令行终端（如 Claude Code, Aider）及自定义 Agent 框架。
   - 将 \`.hvaos/\` 目录下对应的 5 个规则卡片（如 \`01-intent.mdc\`）用人类的回答替换卡片中的占位符。
   - **如果项目涉及代码开发或需要激活 IDE 规则拦截机制**，在终端中执行以下符号链接指令，为 IDE（如 Cursor 等）激活规则卡片：
     \`\`\`bash
     mkdir -p .cursor && ln -sf ../.hvaos .cursor/rules
     \`\`\`
   - **若运行在无 native MDC 规则卡片解析的纯命令行 AI 环境（如 Claude Code、Aider）或自定义 Agent 框架下**：AI 助手必须将本目录下的 5 份 Markdown 规则文档（01-intent 至 05-acceptance）作为全局静态 System Instructions/System Prompt 读入当前 Session，尽可能保持规则对齐。
   - **若运行在 OpenClaw、Hermes 等全局个人助理 Agent 框架下 (常驻网关自适应热加载)**：
     为防止规则因“动态 Skill 按需检索”被绕过，或“硬编码注入”造成日常闲聊污染，请将以下 **【HvAOS 智能体常驻网关元指令 (System Gateway Instructions)】** 复制并追加到您的 Agent 全局 System Prompt / Soul 配置文件中（例如 OpenClaw 的 \`~/.openclaw/agents/<agent-name>/agent.md\` 或 \`soul.md\`，或 Hermes 的角色 Base Prompt 模板）：

     > **[HvAOS System Gateway Daemon Instructions]**
     >
     > *   **Role**: You are a personal assistant equipped with the HvAOS (Human-v-Agent OS) Alignment Gateway.
     > *   **Mode 1: Idle (Casual Conversation)**: If the user is engaging in casual, non-project conversations (e.g. general Q&A, greetings), remain casual and friendly. Do not invoke any workflow guardrails.
     > *   **Mode 2: Active (Project-oriented Tasks)**: If the user initiates a concrete project-oriented task (e.g., coding, writing articles, planning budgets, managing files):
     >     1.  **Detect**: Immediately check the active workspace/project directory for the existence of \`.hvaos/\` rules directory.
     >     2.  **Mount**: If \`.hvaos/\` exists, run file tools to read all 5 alignment cards (\`01-intent.md\` to \`05-acceptance.md\`) in that directory. Treat them as absolute runtime system instructions for the current session.
     >     3.  **Enforce**: Rigidly enforce the **Spec Gate** (ask for user approval before making file changes) and **DoD Checklist** (run verification gates before delivery) specified in the loaded cards.
     >     4.  **Auto-evolving**: Execute self-evolution protocols to update \`04-context.md\` (keep it capped at 5 critical warnings) upon task completion.
3. **完成宣告**：以精简的形式告知人类项目初始化已完成，并列出当前已激活的 5 层规则与运行命令。
`;

    // WHITEPAPER.md
    templates["WHITEPAPER.md"] = `# HvAOS (Human vs AI OS) — 人机协作与意图对齐网关技术白皮书

> **设计哲学**：让规则以最小上下文税自适应载入，以文件级强隔离防止语义冲突，以自主演进机制免除人肉维护成本，牢牢守护大模型推理红线。

---

## 目录
1. [传统 AI 协同文档的“腐烂定理” (The Rot Theorem)](#1-传统-ai-协同文档的腐烂定理-the-rot-theorem)
2. [五层卡片逻辑映射与替代模型 (5-Layer Logical Mapping)](#2-五层卡片逻辑映射与替代模型-5-layer-logical-mapping)
3. [核心默认规则背后的科学依据 (Scientific Principles of Defaults)](#3-核心默认规则背后的科学依据-scientific-principles-of-defaults)
4. [5 大极端边缘情况安全防线 (5 Edge Case Guardrails)](#4-5-大极端边缘情况安全防线-5-edge-case-guardrails)
5. [双层自适应对齐架构设计 (Dual-Layer Adaptive Alignment Architecture)](#5-双层自适应对齐架构设计-dual-layer-adaptive-alignment-architecture)
6. [项目使命、愿景与个人数字分身资产 (Mission, Vision & Digital Twin)](#6-项目使命愿景与个人数字分身资产-mission-vision-digital-twin)
7. [总结 (Conclusion)](#7-总结-conclusion)

---

## 1. 传统 AI 协同文档的“腐烂定理” (The Rot Theorem)

在传统软件开发和协作流程中，团队通常会编写大量文档来对齐人机意图：
*   **产品需求文档 (PRD.md / Product Spec)**：定义做什么、不做什么。
*   **开发与编码规约 (RULES.md / Coding Style)**：定义类名、TypeScript 要求、测试规则。
*   **架构债务文档 (DEBTS.md / Architecture)**：定义当前系统的技术债与历史避坑指南。

### 为什么传统文档会迅速“失效腐烂”？
1.  **AI 的“只读视盲”**：传统的文档散落在 Wiki 网页、Notion 目录或本地 \`docs/\` 文件夹中。大模型在编写代码或执行任务时，**根本不会主动去读取这些文件**。每次对话都依赖人类在输入框里口头提醒。
2.  **人类的“维护惰性”**：当项目发生技术重构（如 Vue 2 升级到 Vue 3）或技术方向微调时，人类由于工作繁忙，很难每次都记得去修改静态文档。AI 助手由于读取了过时的文档规则，依然在生产陈旧、充满 Bug 的代码，导致文档形同虚设。

### HvAOS 的解法：逻辑强绑定与自维护
HvAOS 将所有的 PRD、编码规约、工作流、架构技术债和 DoD 验收标准收敛在 **5 个结构化卡片**中。
这些静态 Markdown 文档将被转换为 **「实时加载的声明式规则配置（软件层面比喻为“规则芯片”）」**：

> [!NOTE]
> **关于“芯片”概念与全端兼容性的澄清说明**：
> 1. **非物理硬件**：这里的“芯片/规则芯片”为**纯软件层的配置概念**，代表带有 YAML 元数据的规则拦截文件（如 \`.mdc\`、\`.cursorrules\` 等），**无需任何物理硬件支持**。
> 2. **IDE 级别（被动读取）**：在 Cursor、Windsurf、Trae 等支持 MDC (Markdown Context) 的 AI IDE 中，通过文件拦截机制，当 AI 修改任意路径的代码时，IDE 会通过文件匹配强行挂载这 5 张规则卡片，AI 在动手前必须遵循。
> 3. **Agent CLI 级别（软件保底）**：在无 native MDC 解析机制的纯命令行 CLI 环境（如 Claude Code、Aider）下，AI 会在启动会话时自动将这 5 份 \`.md\` 规则文档作为全局静态系统指令（System Instructions）读入当前 Session，尽可能实现规则对齐。
> 4. **智能体框架级别（系统级注入）**：在自定义 Agent（如 AutoGen、CrewAI、LangChain 等）中，可直接在系统初始化时，通过代码读取这 5 个卡片内容赋给 Agent 对象的 system_instruction 即可运行。

*   **被动读取**：当 AI 修改任意路径的代码时，IDE 会通过文件匹配强行挂载这 5 张规则卡片，AI 在动手前必须遵循。
*   **主动维护**：AI 在交付任务时（Walkthrough），会自动检测是否引入了新库、改变了目录或踩了新坑，并在后台自动增量更新/修剪上下文卡片，实现**文档与代码的高一致性同步**。

---

## 2. 五层卡片逻辑映射与替代模型 (5-Layer Logical Mapping)

HvAOS 并非凭空创造的指令堆砌，它是将传统项目中散落、无人维护的文档，逻辑上映射并重构为了 5 层结构化卡片：

| 卡片文件 (File Name) | 传统项目中替代了什么？ (What it Replaces) | 以前的做法 (Before HvAOS) | 现在 HvAOS 的替代与进化 (After HvAOS) |
| :--- | :--- | :--- | :--- |
| **\`01-intent.md\`**<br>(意图层) | **轻量级产品需求文档 (PRD)** | 口头在 Chat 框中反复对齐需求，AI 经常写着写着偏离目标受众和核心商业边界。 | 规定项目名称、核心使命以及**“绝对不做的事 (Anti-Goals)”**。从源头限制 AI 的生成概率空间，防止漂移。 |
| **\`02-rules.md\`**<br>(规则层) | **编码风格规范 & 商业安全红线** | 散落在项目中的规则。AI 在长对话中读不完，导致泄漏密钥或乱改代码。 | **逻辑分层的硬性红线与安全栅栏**。规定了 Spec Gate（方案先行）与数据隐私脱敏，严禁 AI 擅自乱动。 |
| **\`03-processes.md\`**<br>(流程层) | **标准操作程序 (SOP) & DevOps 流程** | 靠人类在聊天框中打字催促“你下一步干什么”来维护流程，AI 经常跳过步骤。 | 强制注入 **6 步标准闭环开发流程**与多智能体并发更新锁。为 AI 的前向推理提供硬性反馈轨，防止跳步。 |
| **\`04-context.md\`**<br>(上下文层) | **系统架构设计与历史技术债** | 每次新开对话都要重新把 README、报错日志、历史避坑经验在对话框中给 AI 解释一遍。 | **持久化记忆与已知债务芯片**。AI 交付任务时在后台自动更新和修剪环境技术债（防膨胀限制）。 |
| **\`05-acceptance.md\`**<br>(验收层) | **Definition of Done (DoD / 验收标准)** | 人类肉眼看代码行，或者等上线报错后才发现低级 TODO 占位符、硬编码漏洞。 | **DoD（定义完成）自测门禁**。所有成果交付前必须通过本地校验（格式、敏感词、无 TODO），否则打回。 |

---

## 3. 核心默认规则背后的科学依据 (Scientific Principles of Defaults)

HvAOS 卡片里的默认规则设计，并非拍脑袋拍出来的，而是有着深刻的大语言模型（LLM）认知科学和注意力机制依据：

### ① 为什么默认必须“方案先行 (Spec Gate)”？
*   **LLM 注意力原理**：大模型的本质是基于前文进行概率预测的“自回归生成器 (Auto-regressive Generator)”。如果直接命令 AI 修改代码，它会立刻进入生成模式，缺乏对多方案的比较 and 预判，导致逻辑脱轨。
*   **科学依据**：通过 Spec Gate 强制要求 AI 先写出《实现方案（Implementation Plan）》，这一过程其实是在上下文窗口中强行让大模型进行了一次**“思维链思考（Chain of Thought, CoT）”**。在生成真实的修改代码前，先建立起逻辑通路（Prediction Path），从而使后续的代码修改错误率降低 80% 以上。

### ② 为什么 Context 卡片的警告和避坑列表硬性上限为 5 条？
*   **Lost in the Middle（中间信息丢失）**：2023年斯坦福等研究机构在论文中指出，大模型读取长文本时，对文本“头部”和“尾部”的信息关注度最高，对处于文本“中间”的信息关注度呈 U 型衰减（Lost in the Middle 现象）。
*   **5 条容量的工程可行性与规则流转漏斗**：很多开发者会担心 5 条警告不足以容纳复杂项目的各种历史踩坑。其实，HvAOS 并非机械地丢弃第 6 条之后的教训，而是设计了一套**「动态新陈代谢与规则流转漏斗」**：
    1.  **归纳合并（升维化）**：当遇到新警告时，AI 会被要求对列表进行语义合并，将零散的具体细节（如多个不同模块的 SQL 注入风险点）抽象并合并为一条通用的核心避坑规约。
    2.  **红线/门禁升级（流转出池）**：对于需要永久、无条件遵守的致命错误，HvAOS 规定将其升级迁移——移入 \`02-rules.md\`（成为硬性开发红线）或 \`05-acceptance.md\`（成为自动化 CI 预检门禁，如敏感词扫描或安全性 Lint 脚本），从而释放 Context 警告池的额度。
    3.  **警报解除（自然退役）**：Context 充当的是动态警告缓冲区。一旦某个技术债被彻底重构解决，或 AI 在高频迭代中已形成行为习惯、不再犯同类错误，该警告将自然退役并从卡片中抹去。
*   **科学依据**：如果把历史踩过的 50 个坑全部丢进 Context 文件，大模型会直接忽略大部分，且极大地浪费了上下文 Token 税。通过上限 5 条的流转限制，结合人类短时记忆的认知容量极限（米勒定律 Miller's Law），确保当前阶段最活跃的 5 条警报始终暴露在 Attention 的高权重区，达成 高拦截率（需评测验证）。

### ③ 为什么 01-intent 必须要定义“Anti-Goals (绝对不做的事)”？
*   **语义剪枝 (Semantic Pruning)**：大模型基于语义相似度进行前向生成。若仅定义“Goals（要做的事）”，AI 往往会生成大量看似合理但并不需要的周边功能。
*   **科学依据**：通过明确列出 Anti-Goals，在概率空间中直接对 AI 的“生成可能性”进行了物理剪枝。大模型的注意力矩阵会在这条负向红线前形成阻断，彻底根治 AI 的自我发散和过度设计。

---

## 4. 5 大极端边缘情况安全防线 (5 Edge Case Guardrails)

在真实的企业级多人协作或多 Agent 环境下，规则文件可能会受到并发修改、本地环境污染、长对话注意力丢失等极端情况的影响。HvAOS 部署了以下 5 大隔离防线：

1.  **防占位符裸奔拦截 (Placeholder Strict Block)**：
    *   *机制*：在 MDC 芯片中嵌入拦截指令，如果 5 个 Markdown 文件中还存留 \`{{PLACEHOLDER}}\` 占位符，AI 被强制剥夺文件修改权。唯一允许的行为是引导人类在 Chat 框中回答 3-5 个极简问答题完成 Bootloader 初始化。
2.  **多智能体并发更新锁 (Multi-Agent Single-Writer Lock)**：
    *   *机制*：规定只有主代理 (Orchestrator Agent) 拥有修改 \`.hvaos\` 文件夹的写入权限，子代理 (Subagents) 均为只读，防止多个子 Agent 并发回写上下文时造成文件覆盖冲突 (Race Condition)。
3.  **本地环境脱敏隔离 (Git Env Isolation)**：
    *   *机制*：强制禁止在 \`04-context.md\` 中写入硬编码的本地路径、密码或敏感凭证。环境差异一律指引至读取环境变量 \`.env\`，避免团队协作 Git 提交时将个人本地的特殊路径或密钥泄露并污染他人。
4.  **长对话周期性记忆校准 (Periodic Memory Recap)**：
    - *机制*：对话超过 10 轮时，AI 助手在后续回答的首部加粗 recap 当前活动红线（如 \`[当前红线激活: 方案先行]\`），强行刷新大模型长上下文尾部的 Attention 权重，防止规则被冗长的对话历史吞没。
5.  **无 MDC 解析环境软件保底运行 (CLI Software Fallback)**：
    - *机制*：如果在命令行 CLI 环境下（如 Claude Code）无法自动挂载规则芯片，AI 被要求在启动时将根目录的这 5 个卡片做一次全局性读取并作为静态 System Instructions 注入会话，尽可能保持全终端平台规则对齐。

---

## 5. 双层自适应对齐架构设计 (Dual-Layer Adaptive Alignment Architecture)

In sophisticated multi-agent orchestrators or personal assistant frameworks like **OpenClaw** and **Hermes**, users routinely face a core dilemma:
* **The Skill-based Bypass Trap**: If HvAOS is loaded as a dynamic "Skill" (relying on semantic similarity search), the agent will completely bypass it during routine coding or writing tasks. When a user asks "write a database schema," semantic retrieval matches database-related skills, not the alignment guardrails. Spec Gate and Quality Gate are bypassed.
* **The Soul-based Pollution Trap**: If the rules (which can be up to 2k tokens) are permanently hardcoded into the global Agent Soul / System Prompt, the chatbot will be over-engineered during casual conversations (e.g., a simple movie recommendation prompt is met with a bureaucratic demand for an implementation plan), while also consuming massive API Token Tax.

To resolve this conflict, HvAOS establishes a **Dual-Layer Adaptive Alignment Architecture** that blends **global memory permanence** with **project-level hot-swappable constraints**:

\`\`\`mermaid
graph TD
    User([User Prompt]) --> Gateway[Layer 1: System Gateway <br>Permanent Global Soul]
    Gateway -->|Casual Conversation| Casual[Casual Mode: Default Friendly Assistant]
    Gateway -->|Concrete Project Task| Detect{Local .hvaos/ Folder?}
    Detect -->|Yes| HotLoad[Layer 2: Hot-swappable Rules <br>Auto-mount 5-Layer Cards]
    Detect -->|No| PromptAssign[Prompt User: Which Preset to mount?]
    HotLoad --> Exec[Rigid Guardrail Enforcement: <br>Spec Gate & Quality Gate Active]
\`\`\`

### ① Layer 1: System Gateway (Permanent Global Soul)
A lightweight "subconscious" prompt (tens of tokens) permanently injected into the Agent's global base instructions. It monitors user intents and active paths without maintaining bloated project rules:
* It stays dormant during casual talks, preventing rule pollution.
* Whenever a project task is initiated (e.g., coding, copywriting, budgeting), it automatically commands the agent's file tools to scan the active workspace/directory for a \`.hvaos/\` folder.

### ② Layer 2: Hot-swappable Rules (Local Project Cards)
The actual domain-agnostic 5-layer ruleset (01-intent to 05-acceptance) residing locally inside \`.hvaos/\` at the project's root.
* Upon detecting \`.hvaos/\`, the Gateway commands the agent to read and load the 5 cards into the session.
* The rules are immediately activated: the agent switches to Coder, Writer, or Planner mode dynamically, enforcing the specific Spec Gate and DoD checklist.
* This architecture ensures **high rule alignment without manual agent swapping** and keeps the daily personal assistant completely clean and responsive.

---

## 6. 项目使命、愿景与个人数字分身资产 (Mission, Vision & Digital Twin)

### ① 开源使命与核心愿景
*   **使命 (Mission)**：为大模型自治与协作时代建立一套普适的、低上下文税的双向意图对齐规约。通过强力介入和质量拦截门禁，将人类开发者从低效的“重改地狱”中解救出来。
*   **愿景 (Vision)**：成为跨 AI IDE（如 Cursor 等）、命令行 CLI（如 Claude Code 等）以及主流 Agent 自动化框架（如 AutoGen、CrewAI 等）最核心的“人机行为控制网关”与安全红线基石。

### ② 深远影响：个人数字分身资产 (The Digital Twin Asset)
*   **“会生长”的文档内核**：HvAOS 并非一成不变的死板指令。在长期的人机协同开发中，AI 交付时通过 \`03-processes\` 的自演进协议动态更新 \`04-context\` 避坑列表。这使得这 5 个卡片会针对不同开发者的习惯、项目技术债、API 规约和避坑痛点，**自适应地生长出高度个性化的文档内核系统**。
*   **可复用的数字分身**：随着时间推移，该系统会沉淀为最契合开发者个人编程直觉、工程风格与商业判断力的**「个人经验数字分身/克隆芯片 (Digital Twin Asset)」**。当开发者启动新项目时，只需一键将这套 HvAOS 配置文件复制到根目录下，AI 助手将瞬间读取并完全继承该开发者积累多年的开发品位与避坑经验，达成极高价值的**资产复用**。

### ③ 社区共建与发展蓝图 (Community Roadmap)
1.  **Stage 1 - 基础模板**：完成跨全端平台的开箱即用 5 层卡片规则模板。
2.  **Stage 2 - 规则芯片库 (Rules Hub)**：建立社区主导的行业级最佳实践规则芯片库（Rules Hub），使开发者能够一键装载诸如“React 开发规范芯片”、“SaaS 支付对齐芯片”或“PostgreSQL 迁移红线芯片”等，免去手写成本。
3.  **Stage 3 - 开放行业标准**：推动与全球 AI 开源社区的合作，确立开放的人机意图对齐协议（Open Alignment Protocol），使各类 Autonomous Agent 自行加载并服从人类红线。

---

## 7. 总结 (Conclusion)

HvAOS 并非是一套繁琐的文档流程，而是**一套让文档活过来、让大模型注意力机制稳定响应的 AI 自组织规则网关**。

通过把 PRD、开发规约、SOP工作流、架构债和 DoD 验收逻辑凝练收敛进 5 个高内聚的文件，并利用 MDC 拦截芯片和自维护自演进协议，HvAOS 帮助开发者在生产环境下实现 **高一致性意图对齐**，摆脱**规则负债**与**注意力稀释**，零门槛迈入高确定性的人机协作时代并沉淀专属的数字资产。
`;

    // Build matching .mdc files with full rule bodies (no truncation)
    const mdFiles = ["01-intent", "02-rules", "03-processes", "04-context", "05-acceptance"];
    mdFiles.forEach(f => {
        templates[`.hvaos/${f}.mdc`] = `---
description: Rule alignment for ${f} in ${projectName}
globs: *
---
# ${f.toUpperCase()} MDC chip

🚨 [STRICT INTERCEPTION] If any unresolved double-brace placeholders like "{{PLACEHOLDER}}" exist in your active hvaos rules files (01-intent.md, 02-rules.md, etc.), you are strictly FORBIDDEN from writing any code or making file modifications. Your ONLY permitted action is to guide the user to complete the Bootloader initialization in the chat.

${templates[`${f}.md`]}
`;
    });

    return templates;
}

// Console Simulation typing animation
function loadConsolePreset(presetKey) {
    const consoleCode = document.getElementById("console-code");
    const consoleTitle = document.getElementById("console-domain-title");
    
    if (!consoleCode || !consoleTitle) return;

    const data = presetsData[presetKey];
    consoleTitle.textContent = data.title;
    
    // Simulate terminal clean and refresh
    consoleCode.innerHTML = `<span class="prompt">$</span> loading preset --domain \`${presetKey}\`...\n<span class="log success">[OK] Preset loaded successfully.</span>\n\n`;
    
    setTimeout(() => {
        consoleCode.innerHTML = data.code;
    }, 300);
}

// Copy Prompt to Clipboard
function initCopyBtn() {
    const copyBtn = document.getElementById("copy-prompt-btn");
    const promptContent = document.getElementById("prompt-content");
    const copyIcon = document.getElementById("copy-icon");
    const copyText = document.getElementById("copy-text");

    if (!copyBtn || !promptContent) return;

    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(promptContent.textContent)
            .then(() => {
                // Success feedback
                copyBtn.classList.add("copied");
                copyIcon.innerHTML = `<i class="fa-solid fa-check"></i>`;
                copyText.textContent = "已复制";

                // Reset after 1.5 seconds
                setTimeout(() => {
                    copyBtn.classList.remove("copied");
                    copyIcon.innerHTML = `<i class="fa-regular fa-copy"></i>`;
                    copyText.textContent = "复制指令";
                }, 1500);
            })
            .catch(err => {
                console.error("复制失败: ", err);
                alert("复制失败，请手动选择复制。");
            });
    });
}

// Sandbox Tabs Click Events
function initTabs() {
    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove("active"));
            
            // Add active to current
            const clickedTab = e.currentTarget;
            clickedTab.classList.add("active");
            
            // Load code preset
            const presetKey = clickedTab.getAttribute("data-preset");
            loadConsolePreset(presetKey);
        });
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const toggle = document.getElementById("mobile-toggle");
    const menu = document.getElementById("mobile-menu");

    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
        const isOpen = menu.style.display === "flex";
        if (isOpen) {
            menu.style.display = "none";
            toggle.innerHTML = `<i class="fa-solid fa-bars"></i>`;
        } else {
            menu.style.display = "flex";
            toggle.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        }
    });

    // Close menu when clicking links
    const mobileLinks = menu.querySelectorAll("a");
    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            menu.style.display = "none";
            toggle.innerHTML = `<i class="fa-solid fa-bars"></i>`;
        });
    });
}

// Render dynamic checkboxes for the Generator
function renderGeneratorCheckboxes(presetKey) {
    const container = document.getElementById("dynamic-checkboxes");
    if (!container) return;

    container.innerHTML = "";
    const rules = generatorConfig[presetKey].rules;

    rules.forEach(rule => {
        const label = document.createElement("label");
        label.className = "checkbox-label";
        label.innerHTML = `
            <input type="checkbox" id="${rule.id}" data-text="${rule.text}" data-detail="${rule.detail}" ${rule.checked ? 'checked' : ''}>
            <span class="checkbox-custom"></span>
            <span class="checkbox-text">${rule.text}</span>
        `;
        container.appendChild(label);
    });
}

// Bind Generator form event listeners
function initGenerator() {
    const presetLabels = document.querySelectorAll(".preset-radio-label");
    const projectNameInput = document.getElementById("gen-project-name");
    const projectMissionTextarea = document.getElementById("gen-project-mission");
    const previewZipName = document.getElementById("preview-zip-name");
    const downloadBtn = document.getElementById("btn-download-zip");
    
    // Custom rule elements
    const addCustomRuleBtn = document.getElementById("btn-add-custom-rule");
    const customRulesList = document.getElementById("custom-rules-list");

    if (!projectNameInput || !projectMissionTextarea || !downloadBtn) return;

    // Radio button switcher
    presetLabels.forEach(label => {
        const radio = label.querySelector("input[type='radio']");
        if (!radio) return;

        radio.addEventListener("change", (e) => {
            if (e.target.checked) {
                // Remove active classes
                presetLabels.forEach(l => l.classList.remove("active"));
                // Add active to current
                label.classList.add("active");

                const presetKey = e.target.value;
                // Update default textarea mission
                projectMissionTextarea.value = generatorConfig[presetKey].defaultMission;
                // Render rules list
                renderGeneratorCheckboxes(presetKey);
            }
        });
    });

    // Sync input name with preview zip name
    projectNameInput.addEventListener("input", (e) => {
        const cleanName = e.target.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
        previewZipName.textContent = cleanName ? `${cleanName}-config.zip` : "hvaos-config.zip";
    });

    // Add custom rule item
    if (addCustomRuleBtn && customRulesList) {
        addCustomRuleBtn.addEventListener("click", () => {
            const item = document.createElement("div");
            item.className = "custom-rule-item";
            item.innerHTML = `
                <input type="text" class="custom-rule-input" placeholder="e.g. 严禁在 production 中引入未授权依赖">
                <button type="button" class="btn-delete-rule" title="删除该条"><i class="fa-solid fa-xmark"></i></button>
            `;
            
            // Delete button binding
            const delBtn = item.querySelector(".btn-delete-rule");
            delBtn.addEventListener("click", () => {
                item.remove();
            });

            customRulesList.appendChild(item);
            
            // Auto focus on new input
            item.querySelector("input").focus();
        });
    }

    // Render default coding checkboxes on load
    renderGeneratorCheckboxes("coding");

    // Click download
    downloadBtn.addEventListener("click", () => {
        // Toggle loading status
        downloadBtn.classList.add("loading");
        downloadBtn.disabled = true;
        const btnIcon = document.getElementById("download-btn-icon");
        const btnText = document.getElementById("download-btn-text");
        
        const originalIcon = btnIcon.innerHTML;
        const originalText = btnText.textContent;
        
        btnIcon.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
        btnText.textContent = "正在构建规则包...";

        // Extract settings
        const projectName = projectNameInput.value.trim() || "HvAOS-Workspace";
        const projectMission = projectMissionTextarea.value.trim() || "To run human vs AI alignment rules.";
        const selectedPreset = document.querySelector("input[name='gen-preset']:checked").value;
        
        const activeRules = [];
        const checkboxes = document.querySelectorAll("#dynamic-checkboxes input[type='checkbox']");
        checkboxes.forEach(box => {
            if (box.checked) {
                activeRules.push({
                    text: box.getAttribute("data-text"),
                    detail: box.getAttribute("data-detail")
                });
            }
        });

        // Collect custom rules
        const customInputs = document.querySelectorAll(".custom-rule-input");
        customInputs.forEach(input => {
            const val = input.value.trim();
            if (val) {
                activeRules.push({
                    text: `【自定义规则】${val}`,
                    detail: "User configured custom runtime constraint."
                });
            }
        });

        // Small timeout to simulate dynamic generation loading feel
        setTimeout(() => {
            try {
                // Generate templates structure
                const filesMap = generateMarkdownTemplates(projectName, projectMission, selectedPreset, activeRules);
                
                // Initialize JSZip instance
                const zip = new JSZip();
                
                // Write files into ZIP
                for (const [path, content] of Object.entries(filesMap)) {
                    zip.file(path, content);
                }
                
                // Generate ZIP blob and download
                zip.generateAsync({ type: "blob" }).then((blob) => {
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    
                    const cleanName = projectName.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
                    link.download = cleanName ? `${cleanName}-config.zip` : "hvaos-config.zip";
                    
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // Toggle success status
                    downloadBtn.classList.remove("loading");
                    downloadBtn.classList.add("success");
                    btnIcon.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
                    btnText.textContent = "规则包已下载！";
                    
                    setTimeout(() => {
                        downloadBtn.classList.remove("success");
                        downloadBtn.disabled = false;
                        btnIcon.innerHTML = originalIcon;
                        btnText.textContent = originalText;
                    }, 2000);
                });
            } catch (err) {
                console.error("ZIP Generation Failed: ", err);
                alert("构建压缩包失败，请检查浏览器兼容性或重试。");
                
                // Reset button state
                downloadBtn.classList.remove("loading");
                downloadBtn.disabled = false;
                btnIcon.innerHTML = originalIcon;
                btnText.textContent = originalText;
            }
        }, 1200);
    });
}

async function initEvalStatus() {
    const scoreEl = document.getElementById("eval-score");
    const endedEl = document.getElementById("eval-ended-at");
    const casesEl = document.getElementById("eval-cases");
    if (!scoreEl || !endedEl || !casesEl) return;

    try {
        const resp = await fetch("../artifacts/eval-report.json", { cache: "no-store" });
        if (!resp.ok) {
            scoreEl.textContent = "N/A";
            endedEl.textContent = "未检测到评测报告";
            return;
        }
        const data = await resp.json();
        scoreEl.textContent = data.score || "--/--";
        endedEl.textContent = data.ended_at || "--";
        if (Array.isArray(data.cases)) {
            const names = data.cases.map((x) => x.name).join(", ");
            casesEl.textContent = names || "coding, media, life";
        }
    } catch (error) {
        scoreEl.textContent = "N/A";
        endedEl.textContent = "读取失败";
        console.warn("eval-report load failed", error);
    }
}

// Initial script execution on load
document.addEventListener("DOMContentLoaded", () => {
    initCopyBtn();
    initTabs();
    initMobileMenu();
    initGenerator();
    initEvalStatus();
    
    // Load default preset (coding) on startup
    loadConsolePreset("coding");
});
