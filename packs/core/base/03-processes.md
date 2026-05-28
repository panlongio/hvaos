# 03 - 流程文档：怎么做 (Processes)

## 1. 最小闭环（默认）

1. 意图确认：复述目标、边界、成功标准。
2. 方案提交：列出修改点、风险、验证命令。
3. 审批执行：获“同意/继续”后执行。
4. 验证交付：运行验收命令并给结果。

## 2. 完整闭环（复杂任务）

1. 需求分析
2. 技术方案
3. 人类审批
4. 执行变更
5. 回归验证
6. 交付与复盘

## 3. 每步产出物

- 方案阶段：`implementation-plan`
- 执行阶段：`change-summary`
- 验证阶段：`verification-log`
- 交付阶段：`walkthrough.md`（如项目需要）

## 4. 发布与回滚

- 前置清理：`{{CLEANUP_STEP}}`
- 质量预检：`{{PRE_CHECK_STEP}}`
- 发布执行：`{{PUBLISH_STEP}}`
- 回滚步骤：`{{ROLLBACK_STEP_1}}` -> `{{ROLLBACK_STEP_2}}` -> `{{ROLLBACK_STEP_3}}`
