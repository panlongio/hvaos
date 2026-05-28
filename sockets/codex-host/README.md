# HvAOS CodeX Host Socket Integration Guide

本目录提供了将 HvAOS 规则芯片无缝挂载至 **CodeX 桌面端与 AI 检查器** 的适配配置标准。

---

## ⚙️ 挂载方式 (How to mount)

CodeX 桌面端在导入项目或在项目后台执行代码重构时，会读取根目录下的 [codex-adapter.json](file:///Users/panlong/Documents/code/spase/hvaos/sockets/codex-host/codex-adapter.json) 驱动配置文件，在对应生命周期节点挂载以下物理硬门禁：

1.  **项目导入期 (onProjectImport)**：
    *   自动运行 `bash engine/hvaos-core/verify-hvaos.sh` 进行脚手架与配置文件哈希签名校验。如果项目配置文件被篡改且未获得人类授权，拒绝导入。
2.  **代码生成/重构期 (onCodeGenerate)**：
    *   将当前的重构 Prompt 作为 query 传入 `python3 engine/hvaos-core/hvaos-cli.py lazy-load "<query>"`，执行端侧词袋余弦相似度懒加载检索，仅向大模型注入与当前代码改动最相关的高价值避坑记忆，极致节省 Token 成本。
3.  **生成成功期 (onGenerationSuccess)**：
    *   自动运行 `python3 engine/hvaos-core/hvaos-cli.py prune`，促使 AI 助手自动将本次成功的避坑心得追加为 memories 哈希小文件，并自动压缩多余的 unlocked 日志，保持记忆卡紧凑高效。
