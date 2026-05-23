# 04 - 上下文文档：现在系统是什么状态 (Context)

本文件是项目的长期记忆库，记录了当前的系统状态、技术债与已知存量问题，帮助 AI 助手继承开发/运营的连续性，避免重复踩坑。

---

## 1. 运行环境与依赖配置 (Environment & Config)

*   **当前项目环境简介**：`{{ENVIRONMENT_OVERVIEW}}` (例如：Vite+React开发环境 / 抖音自媒体写作窗口 / Notion 个人日程模板)
*   **平台或依赖要求**：
    - 运行载体：`{{RUNNING_PLATFORM}}` (例如：本地 PostgreSQL 数据库 / 微信公众号编辑器 / Excel 财务记账本)
    - 核心依赖：`{{CORE_DEPENDENCY}}`

---

## 2. 存量债务与遗留问题 (Existing Debts & Issues)

在日常修改相关文件时，AI 助手应当秉持“渐进式优化”的原则，顺手对其进行修复：
- **存量警告/脏数据**：`{{KNOWN_WARNINGS_OR_DIRTY_DATA}}` (例如：存在 700 多个无用的废稿文件 / 代码有 700 多个类型警告 / 表单里有一些重复的分类)
- **未来重构/优化方向**：`{{FUTURE_OPTIMIZATION_DIRECTION}}`

---

## 3. 已尝试但以失败告终的方案 (Failed Attempts - 避坑指南)

> [!WARNING]
> **AI 助手请注意：以下方案在历史尝试中已被证明不可行或存在严重 Bug/灾难。严禁重新提交、提议或采纳以下方向，除非有全新且充足的理由。**

*   **避坑方案一**：
    - *尝试过的做法*：`{{FAILED_ATTEMPT_1_METHOD}}` (例如：尝试用自动化脚本代替人工审核来自动写卡片/视频脚本)
    - *失败的原因/负面影响*：`{{FAILED_ATTEMPT_1_REASON}}` (例如：AI 自动写出的内容有幻觉、格式不齐，导致数据严重紊乱)
    - *最终红线结论*：`{{FAILED_ATTEMPT_1_CONCLUSION}}` (例如：绝对禁止脚本自动发布，核心内容必须经过人工审核)
*   **避坑方案二**：
    - *尝试过的做法*：`{{FAILED_ATTEMPT_2_METHOD}}`
    - *失败的原因/负面影响*：`{{FAILED_ATTEMPT_2_REASON}}`
    - *最终红线结论*：`{{FAILED_ATTEMPT_2_CONCLUSION}}`
