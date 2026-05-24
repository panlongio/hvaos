# HvAos (Human vs AI OS) 项目开发记忆卡

本文件用于在不同会话、不同 IDE 窗口之间无缝同步 AI 助手的上下文记忆，记录了 HvAos 项目的诞生过程、核心决策与技术架构。

---

## 📌 项目基本信息
*   **项目名称**：`HvAos` (即 Human vs AI OS，人机协作与意图对齐网关)
*   **创始人/Owner**：`panlongio` (GitHub: [github.com/panlongio/hvaos](https://github.com/panlongio/hvaos))
*   **官方域名**：[hvaos.com](https://hvaos.com) (以及 [www.hvaos.com](https://www.hvaos.com))
*   **部署托管**：已部署至 Cloudflare Pages 平台，并利用 Wrangler OAuth 凭证通过 Cloudflare REST API 自动绑定了上述双域名。

---

## 🛠️ 项目当前架构设计

为了保证“AI 协作规则模板系统”的纯粹性，并兼顾官方单页的展示，我们采用了**“子目录隔离架构”**：

```text
hvaos/ (项目根目录)
├── 01-intent.md ... 05-acceptance.md  <-- 1. 干净无编程偏见的“AI规则模板文件”
├── hvaos-rules/                       <-- 2. 规则芯片模版 (.mdc 卡片)
├── README-HvAos.md                    <-- 3. 本地集成专属说明书与 AI 引导入口（防 README 冲突）
├── README.md                          <-- 4. 开源主库的 GitHub 首页自述与引导说明
├── LICENSE                            <-- 5. MIT 开源授权协议
├── .gitignore                         <-- 5. 忽略了 macOS 的 .DS_Store 及本地临时 .wrangler/ 缓存
└── website/                           <-- 6. 独立的“官网单页”代码文件夹（由 Cloudflare Pages 托管发布）
    ├── index.html                     <-- 极客深色风的响应式单页
    ├── style.css                      <-- 霓虹渐变与玻璃态样式定义
    └── app.js                         <-- 包含沙盒切换打字机特效与一键拷贝指令
```

---

## 🚀 已达成的里程碑与核心决策

1.  **消除编程偏见**：将原本针对代码开发的术语进行了全面去编程化替换。
2.  **品牌更名与域名保障**：买下 `hvaos.com` 和 `www.hvaos.com` 并成功部署托管在 Cloudflare Pages 上，SSL 证书已绿灯生效。
3.  **精细化多场景预设模板**：在根目录下交付了 Coding (软件开发)、Media (自媒体写稿)、Life (个人助理) 场景全套高标准英文规则卡片，位于 `presets/` 目录。
4.  **可视化配置与自定义生成器**：在官网部署了交互面板，支持在线勾选场景、**手写添加自定义红线规则**，并由 JSZip 纯前端打包一键下载 `.zip` 配置。
5.  **一键终端装载脚本**：发布并部署了 `install.sh` 终端脚本，支持开发者直接在终端拉取预设并在本地生成 `.hvaos/` 核心规则目录，且自动为 Cursor 等 IDE 建立软链接。
6.  **官网文案痛点化重构**：全面改写首页主标题与 5 层架构简介，直击 AI “胡说八道、自作主张、劳心劳力劳钱重改地狱”的真实痛点，引导用户通过 HvAos 给 AI 戴“金箍”。

---

## 📅 下一阶段开发规划 (Next Steps)

本项目已达成完全体商业级交付，目前无紧急待办事项。未来迭代建议：
*   **【扩展场景库】**：根据社区用户反馈，增加更多特定应用领域的 presets 预设（例如：学术论文起草、财务合同报销审查等）。
