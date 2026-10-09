# HvAOS Context Protocol Specification（上下文协议规范）

**版本**：1.0-draft
**状态**：草案（Draft）
**目标**：定义一套跨 Agent 通用的"默认上下文"格式，让用户的意图、规则、流程、记忆、验收标准可以打包携带，在任何兼容的 Agent / IDE / CLI 之间加载生效。

> 设计哲学：记忆系统是各家方言，本协议是普通话。

---

## 1. 设计原则

1. **文件优先**：纯 Markdown + YAML frontmatter，人可读、机器可解析，不依赖任何私有服务。
2. **分层隔离**：5 层卡片各管一摊，文件级隔离，杜绝语义冲突。
3. **最小上下文税**：按需挂载，不污染 Agent 的全局上下文。
4. **版本化**：协议本身有版本号，保证向前兼容。
5. **Agent 无关**：不绑定任何厂商、IDE 或模型。

---

## 2. 包结构

一个兼容包是一个目录（约定名为 `.hvaos/`），放在项目根目录：

```
.hvaos/
├── manifest.yaml        # 协议清单：版本、卡片列表、校验信息（必需）
├── 01-intent.md         # 意图层
├── 02-rules.md          # 规则层
├── 03-processes.md      # 流程层
├── 04-context.md        # 上下文层
└── 05-acceptance.md     # 验收层
```

---

## 3. manifest.yaml 字段规范

```yaml
spec_version: "1.0"          # 本规范的版本，必需
name: "my-project"          # 包名，必需
description: "..."          # 一句话描述，可选
identity:                   # 可选：外部身份声明的引用，见 §9
  provider: "agentid"
  agent_id: "..."

cards:                      # 5 张卡片清单，必需
  - layer: intent
    path: "01-intent.md"
    version: "1.2.0"
    sha256: "..."           # 内容校验，推荐
  - layer: rules
    path: "02-rules.md"
    version: "1.0.0"
    sha256: "..."
  # ... processes / context / acceptance 同理

mounts:                     # 挂载声明，可选
  ide:                      # 支持 MDC 的 IDE（Cursor 等）
    enabled: true
    glob: ".hvaos/*.mdc"
  cli_fallback: true        # 无 MDC 环境时回退为 System Instructions 注入
```

字段说明：

| 字段 | 必需 | 说明 |
| :--- | :--- | :--- |
| `spec_version` | 是 | 遵循 SemVer，主版本号不一致时 Agent 必须拒绝加载并提示 |
| `name` | 是 | 包名，`[a-z0-9-]` |
| `cards[].layer` | 是 | 取值限定：`intent` `rules` `processes` `context` `acceptance` |
| `cards[].sha256` | 推荐 | Agent 加载时校验完整性，不匹配则拒绝并告警 |
| `identity` | 否 | 外部身份声明的引用（`provider`/`agent_id`/`owner`），见 §9；HvAOS 只透传、不签发不校验 |

---

## 4. 卡片格式规范

每张卡片 = YAML frontmatter + Markdown 正文。

```markdown
---
layer: rules
version: 1.0.0
updated: 2026-10-08
---

# 规则层
...
```

规则：

- **占位符**：未填充的变量统一用 `{{PLACEHOLDER}}`。只要任一卡片存在未填充占位符，Agent 不得执行写入操作，只能进入 Bootloader 问答流程（见 §6）。
- **04-context 条目上限**：警告/避坑条目硬性上限 5 条。超出时按"流转漏斗"处理：语义合并 → 升级为红线（移入 02-rules）或门禁（移入 05-acceptance）→ 自然退役。
- **敏感信息禁令**：卡片内禁止出现密钥、token、硬编码本地路径。环境差异一律指向环境变量。

---

## 5. Agent 加载协议

兼容的 Agent 在检测到项目任务时，按以下流程处理：

```
1. DISCOVER  在项目根目录查找 `.hvaos/manifest.yaml`
2. VERIFY    校验 spec_version 兼容性 + cards sha256 完整性
3. MOUNT     按需读取 5 张卡片，注入当前会话
4. ENFORCE   激活 Spec Gate（动手前出方案）与验收门禁
```

- **无 manifest 时**：Agent 应询问用户挂载哪个 preset，而不是静默跳过。
- **版本不兼容时**：拒绝加载并明确提示，不允许降级强行读取。
- **按需挂载**：日常闲聊不加载任何卡片，只有进入项目任务时才挂载（最小上下文税）。

---

## 6. Bootloader 初始化协议

首次使用（存在 `{{PLACEHOLDER}}`）时，Agent 必须：

1. 依次扫描 5 张卡片，收集所有占位符；
2. 每次向用户提出不超过 5 个问题（多选优先），对齐意图；
3. 用用户回答填充占位符，写回卡片并更新 `manifest.yaml` 中的版本与 sha256；
4. 完成后运行自检（`verify`），确认无残留占位符。

---

## 7. 平台适配

| 平台 | 挂载方式 |
| :--- | :--- |
| AI IDE（Cursor 等，支持 MDC） | 通过文件 glob 被动拦截挂载 |
| CLI（Claude Code、Aider 等） | 启动时全文读入，作为 System Instructions 注入 |
| Agent 框架（AutoGen、CrewAI、LangChain 等） | 初始化时读取卡片内容，赋给 `system_instruction` |

平台差异只影响"怎么挂载"，不影响"挂载什么"——卡片内容与协议一致。

---

## 8. 并发与安全

- **单写者锁**：只有主 Agent（Orchestrator）可写 `.hvaos/`，子 Agent 只读，防止并发覆盖。
- **占位符拦截**：见 §4、§6。
- **环境隔离**：本地路径、密钥走环境变量，不进卡片、不进 Git。

---

## 9. 与身份层的关系

本协议是**上下文/约束层**协议，只回答"Agent 记住什么、遵守什么"，不回答"Agent 是谁"。

- **身份层归身份层**：Agent 的身份标识与归属校验由专门的身份协议/服务解决。本协议不签发、不管理身份，只在需要时**消费**身份声明（如 `agent_id`、`owner`）。
- **兼容现有实现**：身份层可采用任何与 OIDC 兼容的实现，例如 AgentID（AgentMail 推出的商业产品，即"Agent 的 Sign in with Google"：为每个 Agent 签发稳定 ID、已验证邮箱，并标明 `actor_type="agent"`）。本协议对具体选型不做强制要求——AgentID 是身份层的**一种实现**，不是行业标准。
- **manifest 引用方式**：如需在包内声明身份归属，在 `manifest.yaml` 中以可选字段引用外部身份标识：

```yaml
identity:                    # 可选
  provider: "agentid"        # 身份提供方标识
  agent_id: "..."            # 外部签发的 Agent 稳定 ID
  owner: "user@example.com"  # 属主已验证邮箱
```

- **分层原则**：同一个上下文包可以在不同身份的 Agent 之间携带（这正是"普通话"的价值）；身份只决定"谁在使用这个包"，不改变包的内容语义。

---

## 10. 版本与兼容性

- 协议版本遵循 SemVer。
- `minor`/`patch` 升级向后兼容：旧 Agent 可读新包（忽略未知字段）。
- `major` 升级不兼容：Agent 必须拒绝并提示用户升级。

---

## 11. 开放问题（Roadmap）

- [ ] **Soul Hub**：社区规则市场，一键装载行业 preset（React 规范、SaaS 支付红线等）
- [ ] **跨 Agent 记忆携带**：把 04-context 的"数字分身"在不同 Agent 间迁移（v2）
- [ ] **签名与信任**：第三方 preset 包的签名验证机制

---

*本规范为草案，欢迎通过 Issue 参与讨论。*
