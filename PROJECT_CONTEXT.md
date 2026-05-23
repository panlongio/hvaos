# HvAOS (Human vs AI OS) 项目开发记忆卡

本文件用于在不同会话、不同 IDE 窗口之间无缝同步 AI 助手的上下文记忆，记录了 HvAOS 项目的诞生过程、核心决策与技术架构。

---

## 📌 项目基本信息
*   **项目名称**：`HvAOS` (即 Human vs AI OS，人机协作与意图对齐网关)
*   **创始人/Owner**：`panlongio` (GitHub: [github.com/panlongio/hvaos](https://github.com/panlongio/hvaos))
*   **官方域名**：[hvaos.com](https://hvaos.com) (以及 [www.hvaos.com](https://www.hvaos.com))
*   **部署托管**：已部署至 Cloudflare Pages 平台，并利用 Wrangler OAuth 凭证通过 Cloudflare REST API 自动绑定了上述双域名。

---

## 🛠️ 项目当前架构设计

为了保证“AI 协作规则模板系统”的纯粹性，并兼顾官方单页的展示，我们采用了**“子目录隔离架构”**：

```text
hvaos/ (项目根目录)
├── 01-intent.md ... 05-acceptance.md  <-- 1. 干净无编程偏见的“AI规则模板文件”
├── agent-rules/                       <-- 2. 规则芯片模版 (.mdc 卡片)
├── README.md                          <-- 3. 开源项目的 AI 初始化引导说明书
├── LICENSE                            <-- 4. MIT 开源授权协议
├── .gitignore                         <-- 5. 忽略了 macOS 的 .DS_Store 及本地临时 .wrangler/ 缓存
└── website/                           <-- 6. 独立的“官网单页”代码文件夹（由 Cloudflare Pages 托管发布）
    ├── index.html                     <-- 极客深色风的响应式单页
    ├── style.css                      <-- 霓虹渐变与玻璃态样式定义
    └── app.js                         <-- 包含沙盒切换打字机特效与一键拷贝指令
```

---

## 🚀 已达成的里程碑与核心决策

1.  **消除编程偏见**：将原本针对代码开发的术语进行了全面去编程化替换，如“产出与编辑”替代“代码”，“质量预检”替代“编译检查”，“存量防错”替代“回归测试”。
2.  **品牌更名与域名保障**：将臃肿的 `AI-Collaboration-OS` 精简更名为 `HvAOS`，并以 `panlongio` 身份买下了完全空闲的 `.com` 域名，排除了抢注和知识产权风险。
3.  **极客官网发布**：在 `website/` 下完成了官方交互落地页的开发。网页内置了 **【软件开发 / 自媒体写稿 / 生活助手】** 三套预设沙盒的打字机演示特效，以及一键复制 Bootloader 指令的功能。

---

## 📅 下一阶段开发规划 (Next Steps)

AI 助手在新窗口唤醒后，建议从以下任务开始入手：

1.  **【首要任务】精细化多场景预设模板**：
    *   在根目录下新建 `presets/` 文件夹。
    *   为 **软件开发 (presets/coding/)**、**自媒体运营 (presets/media/)**、**个人助理/生活理财 (presets/life/)** 编写真正开箱即用、带有个性化红线和验收指标的 5 层 Markdown 模板。
2.  **【第二阶段】升级官网为“可视化规则生成器”**：
    *   在 `website/` 下开发表单交互，允许用户通过网页勾选自己需要的规则，一键打包生成并下载 `.zip` 规则配置包。
