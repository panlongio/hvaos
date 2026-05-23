# 05 - 验收文档：怎么判断做对了 (Acceptance)

本文件是项目的质量门禁。任务的最终完成状态必须经过本标准的强校验，禁止 AI 提交带有低级瑕疵或未经验证的工作成果。

---

## 1. 质量预检门禁 (Quality Pre-checks)

AI 在声称任务“已完成”前，必须运行并通过以下预检步骤：
- **静态预检命令/方法**：`{{STATIC_CHECK_METHOD}}` (例如：软件运行 npm run check 验证编译 / 写稿时使用文本对比检测重复率与敏感词)
- **存量回归测试/对比**：`{{REGRESSION_CHECK_METHOD}}` (例如：运行测试套件 npm run test / 将生成的推文调性与往期爆款文案进行对齐校验)
- **代码/格式风格审计**：`{{STYLE_AUDIT_METHOD}}` (例如：运行 eslint 代码美化 / 检查文章段落的排版缩进与符号使用)

---

## 2. 人工体验与设计验收标准 (Manual UX Standards)

*   **视觉与交互规范**：`{{MANUAL_VISUAL_STANDARD}}` (例如：按钮对齐、文字无重叠、微动效流畅 / 文档配图高清晰度、无文字毛边)
*   **文案表达规范**：`{{MANUAL_COPY_STANDARD}}` (例如：标题精炼在 20 字以内，重点句加粗，段落之间预留空行便于人类扫读)

---

## 3. 资源预算与限额指标 (Resource Budgets)

新交付的内容或资源必须限制在以下预算内，禁止产生冗余或臃肿：
- `{{RESOURCE_LIMIT_1}}` (例如：前端打包后的包体积增加不超过 50KB / 文章总字数严控在 400 字以内)
- `{{RESOURCE_LIMIT_2}}`

---

## 4. 绝对不可接受的交付结果 (Negative Gatekeeper - 负面清单)

> [!CAUTION]
> **只要交付物中出现以下任意一项，即判定本次交付为不合格，AI 必须无条件重新修正或回退：**

*   `{{UNACCEPTABLE_OUTCOME_1}}` (例如：残留 console.log 等调试代码 / 文案中包含不合规的敏感词汇 / 包含 temporary 占位图)
*   `{{UNACCEPTABLE_OUTCOME_2}}` (例如：生成了大量无意义的临时垃圾文件，且未能在运行后自动清理干净)
*   `{{UNACCEPTABLE_OUTCOME_3}}`
