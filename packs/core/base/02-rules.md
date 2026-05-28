# 02 - 规则文档：红线与约束 (Rules)

```yaml
runtime_rules:
  blockers:
    - rule_id: "spec_gate"
      name: "方案先行"
      trigger: "实质性文件变更/代码编写/大纲重写"
      check: "先给可执行方案，且获得同意/继续后才能执行"
      action_on_violation: "阻断执行，回退到方案审批"
    - rule_id: "privacy_guard"
      name: "凭证与隐私安全"
      trigger: "涉及密钥、账号、个人信息"
      check: "敏感信息脱敏，不得明文提交"
      action_on_violation: "阻断输出并要求脱敏"
    - rule_id: "minimal_change"
      name: "最小改动原则"
      trigger: "任何修改任务"
      check: "改动范围仅覆盖任务直接相关内容"
      action_on_violation: "阻断并要求缩小改动范围"
```

## 1. Blocker（违反即阻断）

1. **方案先行**
- 触发：实质性文件变更/代码编写/大纲重写。
- 约束：先给可执行方案，获“同意/继续”后执行。
- 例外：纯只读检查与问答。
2. **凭证与隐私安全**
- 触发：涉及密钥、账号、个人信息。
- 约束：严禁明文提交；敏感信息必须脱敏。
- 例外：无。
3. **最小改动原则**
- 触发：任何修改任务。
- 约束：只改与任务直接相关的最小范围。
- 例外：用户明确批准重构。

## 2. Warning（触发需显式提示）

- **规则膨胀风险**：`04-context.md` 每类最多保留 5 条，超出需合并。
- **多代理冲突风险**：仅主代理可写 `.hvaos` 规则文件。

## 3. Advice（最佳实践建议）

- 面临多方案时，必须给推荐方案和理由。
- 可复用步骤优先脚本化，减少手工重复。

## 4. 场景规则插槽

- **媒体场景**：`{{MEDIA_TONE_RULE}}` / `{{MEDIA_FORMAT_RULE}}` / `{{MEDIA_COMPLIANCE_RULE}}`
- **生活场景**：`{{LIFE_BUDGET_RULE}}` / `{{LIFE_SCHEDULE_RULE}}`
- **开发场景**：`{{CODE_TYPE_RULE}}` / `{{CODE_UI_RULE}}` / `{{CODE_DB_RULE}}`
