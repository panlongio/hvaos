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
6. **Delivery Walkthrough**: Document the exact changes and validation outcomes.

---

## 2. Distribution & Publishing

- **Cleanup**: Delete mock data, temporary files, and caching logs before staging.
- **Check**: Perform a final compile or readability test.
- **Release**: Sync to production or target channels.
`;

    // 04-context.md
    templates["04-context.md"] = `# 04 - Context Document (System State & Historical Debts)

This document tracks active tools, technical debts, and past experiments.

---

## 1. Active Tools & Setup

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
    templates["README-HvAOS.md"] = `# HvAOS (Human vs AI OS) — 人机协作与意图对齐操作系统使用指南

> **HvAOS** 是一个极简、 domain-neutral（领域无关）的 AI 协同协议与规则模板系统。
> **HvA (Human vs AI)** 代表人机双向博弈与意图对齐。它就像您的 AI 运行网关（Gatekeeper），通过 5 层架构牢牢守住任何项目的执行质量与合规红线，防止 AI 脱缰或生成无效产出。

---

## 👨‍💻 人类（您）使用说明

*   **一键自动启动**：如果您是通过运行 \`install.sh\` 脚本一键装载的，**AI 助手在安装完成后会自动读取协议并向您发起提问**，您只需直接在聊天框中回答即可！
*   **手动启动（备用 / ZIP下载用户）**：如果您是通过官网下载 ZIP 解压的，或者您的 AI 助手没有自动发起提问，请复制并向 AI 发送以下指令以手动激活：
    > “请读取项目里的 \`README-HvAOS.md\` 文件，并执行其中的【AI 智能启动与初始化协议】。”
*   **回答**：无论何种方式启动后，AI 都会为您整理出一份极简的定制问题（一般不超过 5 个）。您只需简单回答，AI 就会自动补齐所有场景占位符并激活规则卡片！

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
   - 将 \`.hvaos/\` 目录下对应的 5 个规则卡片（如 \`01-intent.mdc\`）用人类的回答替换卡片中的占位符。
   - **如果项目涉及代码开发或需要激活 IDE 规则拦截机制**，在终端中执行以下符号链接指令，为 IDE（如 Cursor 等）激活规则卡片：
     \`\`\`bash
     mkdir -p .cursor && ln -sf ../.hvaos .cursor/rules
     \`\`\`
3. **完成宣告**：以精简的形式告知人类项目初始化已完成，并列出当前已激活 of 5 层规则与运行命令。
`;

    // Build matching .mdc files
    const mdFiles = ["01-intent", "02-rules", "03-processes", "04-context", "05-acceptance"];
    mdFiles.forEach(f => {
        templates[`.hvaos/${f}.mdc`] = `---
description: Rule alignment for ${f} in ${projectName}
globs: *
---
# ${f.toUpperCase()} MDC chip

${templates[`${f}.md`].substring(0, 300)}... (Refers to root level ${f}.md for complete rules)`;
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

// Initial script execution on load
document.addEventListener("DOMContentLoaded", () => {
    initCopyBtn();
    initTabs();
    initMobileMenu();
    initGenerator();
    
    // Load default preset (coding) on startup
    loadConsolePreset("coding");
});
