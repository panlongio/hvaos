// sockets/vscode-extension/extension.js
// VS Code 宿主卡槽插件 (HvAOS Cognitive Socket) 核心逻辑原型

const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 创建一个全局的 OutputChannel 用于记录调试日志，便于用户和 CI 验证
let outputChannel;

/**
 * 插件激活入口
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    outputChannel = vscode.window.createOutputChannel("HvAOS Socket");
    outputChannel.appendLine('[HvAOS Socket] VS Code rule socket activated.');

    // 自动扫描与 Bootloader 引导
    autoDetectAndBootstrap();

    // 注册一键激活命令
    let bootstrapCmd = vscode.commands.registerCommand('hvaos.bootstrap', function () {
        runInteractiveWizard();
    });
    context.subscriptions.push(bootstrapCmd);

    // 监听活跃编辑器变化（双通道灵魂热插拔的核心拦截器）
    let activeEditorListener = vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            handleEditorChange(editor);
        } else {
            clearActiveSoul();
        }
    });
    context.subscriptions.push(activeEditorListener);

    // 初始化触发一次（应对启动时就已经有文件处于打开状态的冷启动情况）
    if (vscode.window.activeTextEditor) {
        handleEditorChange(vscode.window.activeTextEditor);
    }
}

/**
 * 自动识别项目根目录是否有 .hvaos 芯片，若无则弹出气泡引导
 */
function autoDetectAndBootstrap() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return;

    const rootPath = workspaceFolders[0].uri.fsPath;
    const hvaosPath = path.join(rootPath, '.hvaos');

    if (!fs.existsSync(hvaosPath)) {
        vscode.window.showInformationMessage(
            '👋 检测到当前项目尚未装载 HvAOS 规则芯片。是否需要 AI 引导一键激活意图与防错网关？',
            '一键装载',
            '忽略'
        ).then(selection => {
            if (selection === '一键装载') {
                runInteractiveWizard();
            }
        });
    } else {
        outputChannel.appendLine('[HvAOS Socket] Rules directory found. Slot active.');
    }
}

/**
 * 双通道灵魂拼装与热插拔分发逻辑
 * @param {vscode.TextEditor} editor 
 */
function handleEditorChange(editor) {
    try {
        const doc = editor.document;
        if (!doc) return;

        const filePath = doc.uri.fsPath;
        const ext = path.extname(filePath).toLowerCase();

        // 仅对常见的代码后缀进行规则热加载匹配，其余文件直接清空
        if (!['.js', '.jsx', '.ts', '.tsx', '.py', '.go', '.rs'].includes(ext)) {
            clearActiveSoul();
            return;
        }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(doc.uri);
        if (!workspaceFolder) return;
        const rootPath = workspaceFolder.uri.fsPath;

        const matchedSouls = [];

        // 通道一：Glob 粗筛
        if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
            matchedSouls.push('base-ts');
        }

        // 通道二：快速正则 Import 分析（仅读取文件头部前 2000 个字符）
        const headerText = doc.getText().slice(0, 2000);
        
        // 匹配 stripe 相关的导入 (import 或 require)
        const stripeImportRegex = /import\s+[\s\S]*?\s+from\s+['"](?:@stripe\/stripe-js|stripe)['"]/i;
        const stripeRequireRegex = /require\s*\(\s*['"](?:@stripe\/stripe-js|stripe)['"]/i;
        if (stripeImportRegex.test(headerText) || stripeRequireRegex.test(headerText)) {
            matchedSouls.push('stripe');
        }

        // 匹配 supabase 相关的导入
        const supabaseImportRegex = /import\s+[\s\S]*?\s+from\s+['"](?:@supabase\/supabase-js)['"]/i;
        const supabaseRequireRegex = /require\s*\(\s*['"](?:@supabase\/supabase-js)['"]/i;
        if (supabaseImportRegex.test(headerText) || supabaseRequireRegex.test(headerText)) {
            matchedSouls.push('supabase');
        }

        // 如果没有任何灵魂被匹配到，直接清理现存的活跃灵魂卡片
        if (matchedSouls.length === 0) {
            clearActiveSoul();
            return;
        }

        // 拼接读取 rules-pool 里的文件片段
        const poolPath = path.join(rootPath, '.hvaos', 'rules-pool');
        let combinedRules = '';

        matchedSouls.forEach(soulName => {
            const soulFilePath = path.join(poolPath, `${soulName}.mdc`);
            if (fs.existsSync(soulFilePath)) {
                const fragment = fs.readFileSync(soulFilePath, 'utf-8');
                combinedRules += `\n\n---\n\n${fragment.trim()}`;
            } else {
                outputChannel.appendLine(`[HvAOS WARNING] Soul fragment file missing: ${soulFilePath}`);
            }
        });

        if (combinedRules.trim() === '') {
            clearActiveSoul();
            return;
        }

        // 拼装最终的 .mdc 灵魂定义文件
        const activeSoulPath = path.join(rootPath, '.cursor', 'rules', 'active-soul.mdc');
        const activeSoulDir = path.dirname(activeSoulPath);

        if (!fs.existsSync(activeSoulDir)) {
            fs.mkdirSync(activeSoulDir, { recursive: true });
        }

        const fileContent = `---
description: HvAOS Active Soul - Hot-swapped context and safety rules dynamically injected for the current file
globs: *
---
# HvAOS Active Rules Soul (活跃规则灵魂)

🚨 [STRICT INTERCEPTION] Rules in this soul are active because they match your current file extension and imported dependencies.

${combinedRules.trim()}
`;

        fs.writeFileSync(activeSoulPath, fileContent, 'utf-8');
        outputChannel.appendLine(`[HvAOS Socket] [SUCCESS] Active soul dynamically refreshed. Loaded: [${matchedSouls.join(', ')}]`);
    } catch (e) {
        outputChannel.appendLine(`[HvAOS ERROR] handleEditorChange failed: ${e.message}`);
    }
}

/**
 * 清除本地活跃灵魂芯片
 */
function clearActiveSoul() {
    try {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) return;

        const rootPath = workspaceFolders[0].uri.fsPath;
        const activeSoulPath = path.join(rootPath, '.cursor', 'rules', 'active-soul.mdc');

        if (fs.existsSync(activeSoulPath)) {
            fs.unlinkSync(activeSoulPath);
            outputChannel.appendLine('[HvAOS Socket] Active soul cleared.');
        }
    } catch (e) {
        outputChannel.appendLine(`[HvAOS ERROR] clearActiveSoul failed: ${e.message}`);
    }
}

/**
 * 宿主交互式引导流程 (利用 VS Code 原生 InputBox 代替 CLI 交互)
 */
async function runInteractiveWizard() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('[HvAOS] 请先打开一个项目目录！');
        return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const cliPath = path.join(rootPath, 'engine', 'hvaos-core', 'hvaos-cli.py');

    // 引导 Q1: 核心目标
    const target = await vscode.window.showInputBox({
        prompt: '👉 [Q1/3] 您本次开发的核心任务目标是什么？(例如: 写个邮箱登录接口)',
        placeHolder: 'e.g. 搭建 Stripe 支付 Webhook 接收回调'
    });
    if (!target) return;

    // 引导 Q2: 高危禁区
    const antigoals = await vscode.window.showInputBox({
        prompt: '👉 [Q2/3] 有哪些文件或目录是 AI 绝对禁止触碰 and 修改的？(无硬性限制请直接回车)',
        placeHolder: 'e.g. 不要碰 api/auth.py。默认无限制'
    });

    // 引导 Q3: 验收标准
    const acceptance = await vscode.window.showInputBox({
        prompt: '👉 [Q3/3] 本次任务的完成交付标准（DoD）是什么？(无硬性限制请直接回车)',
        placeHolder: 'e.g. npm run build 编译通过。默认无限制'
    });

    // 拼装 python 命令行以调用 hvaos-cli 自主生成芯片
    const pythonCmd = `python3 "${cliPath}" add-memory "Goals: ${target} | Forbidden: ${antigoals || 'None'} | DoD: ${acceptance || 'None'}" --locked`;

    exec(pythonCmd, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage(`[HvAOS] 芯片装载失败: ${stderr || error.message}`);
            return;
        }
        
        // 生成 01-intent 核心芯片文件
        const intentMarkdown = `# 01-intent\n\n## Core Goals\n- [ ] ${target}\n\n## Anti-Goals\n- **[RESTRICTED]** ${antigoals || 'None'}\n\n## DoD Acceptance\n- [ ] ${acceptance || 'None'}\n`;
        const mdcTemplate = `---\ndescription: hvaos-intent: Project specific development goals, file boundaries, and anti-goals constraint.\nglobs: *\n---\n${intentMarkdown}`;
        
        try {
            const hvaosDir = path.join(rootPath, '.hvaos');
            fs.mkdirSync(hvaosDir, { recursive: true });
            fs.writeFileSync(path.join(hvaosDir, '01-intent.md'), intentMarkdown);
            fs.writeFileSync(path.join(rootPath, '01-intent.md'), intentMarkdown);
            fs.writeFileSync(path.join(hvaosDir, '01-intent.mdc'), mdcTemplate);
            
            // 重新编译 rules 并分发到 IDE rules 目录
            const compileCmd = `python3 "${cliPath}" compile`;
            exec(compileCmd, (cErr) => {
                if (cErr) {
                    console.error('[HvAOS] Failed to compile rules after bootstrap:', cErr);
                }
            });
            
            vscode.window.showInformationMessage('🎉 HvAOS 规则芯片已成功装载并激活！AI 防错网关已就位。');
        } catch (e) {
            vscode.window.showErrorMessage(`[HvAOS] 写入芯片文件失败: ${e.message}`);
        }
    });
}

function deactivate() {
    outputChannel.appendLine('[HvAOS Socket] VS Code rule socket deactivated.');
}

module.exports = {
    activate,
    deactivate
}
