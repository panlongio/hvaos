// Presets Data for the Sandbox Console
const presetsData = {
    coding: {
        title: "Coding Mode (💻 软件开发)",
        code: `<span class="comment"># HvAOS - 💻 软件开发规则预设 (.agent/rules/02-rules.mdc)</span>

<span class="key">- 核心开发红线 (Redlines):</span>
  1. 未在对话中明确获得人类输入 <span class="string">"同意"</span> 或 <span class="string">"继续"</span> 前，禁止修改任何代码或文件。
  2. <span class="accent">【绝对禁令】</span> 严禁将任何密码、API 密钥、Token 或 .env 配置文件提交到代码库。
  
<span class="key">- 手术刀精准修改 (Precision Coding):</span>
  1. 遵循最小改动原则，精准修复，绝不为修改局部问题而大范围重写邻近代码。
  2. 保持原有注释和文档的完整性，新增代码必须附带英文注释。

<span class="key">- 质量预检门禁 (Quality Gates):</span>
  1. 逻辑修改后，必须在本地运行 <span class="string">"npm run check"</span> / <span class="string">"npm run test"</span>。
  2. 提交代码时，Git 提交信息必须以语义化前缀规范开头 (例如: <span class="string">"feat: xxxx"</span>, <span class="string">"fix: xxxx"</span>)。`
    },
    media: {
        title: "Media Mode (✍️ 自媒体写稿)",
        code: `<span class="comment"># HvAOS - ✍️ 自媒体与内容运营预设 (.agent/rules/02-rules.mdc)</span>

<span class="key">- 核心内容红线 (Redlines):</span>
  1. 内容中严禁出现任何未经证实的谣言，严禁搬运或抄袭未授权的内容。
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
        code: `<span class="comment"># HvAOS - 📅 个人助理/生活理财规则预设 (.agent/rules/02-rules.mdc)</span>

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

// Initial script execution on load
document.addEventListener("DOMContentLoaded", () => {
    initCopyBtn();
    initTabs();
    initMobileMenu();
    
    // Load default preset (coding) on startup
    loadConsolePreset("coding");
});
