# 05 - 验收文档：如何判定通过 (Acceptance)

```yaml
acceptance_assertions:
  - assert_id: "static_checks"
    method: "{{STATIC_CHECK_METHOD}}"
    pass_criteria: "静态检查命令全部通过且退出码为 0"
  - assert_id: "regression_checks"
    method: "{{REGRESSION_CHECK_METHOD}}"
    pass_criteria: "回归检查全部通过且无 blocker 级失败"
  - assert_id: "style_audit"
    method: "{{STYLE_AUDIT_METHOD}}"
    pass_criteria: "风格审计无阻断项"
```

## 1. 可执行验收项（必须可检查）

- 静态检查：`{{STATIC_CHECK_METHOD}}`
- 回归检查：`{{REGRESSION_CHECK_METHOD}}`
- 风格审计：`{{STYLE_AUDIT_METHOD}}`

## 2. 人工体验项

- 视觉交互标准：`{{MANUAL_VISUAL_STANDARD}}`
- 文案表达标准：`{{MANUAL_COPY_STANDARD}}`

## 3. 资源预算

- `{{RESOURCE_LIMIT_1}}`
- `{{RESOURCE_LIMIT_2}}`

## 4. Blocker 清单（失败即阻断，最多 5 条）

1. `{{UNACCEPTABLE_OUTCOME_1}}`
2. `{{UNACCEPTABLE_OUTCOME_2}}`
3. `{{UNACCEPTABLE_OUTCOME_3}}`
