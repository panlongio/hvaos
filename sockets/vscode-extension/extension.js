// sockets/vscode-extension/extension.js
// VS Code 宿主卡槽插件 (HvAOS Cognitive Socket) 核心逻辑原型

const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

/**
 * 插件激活入口
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('[HvAOS Socket] VS Code rule socket activated.');

    // 自动扫描与 Bootloader 引导
    autoDetectAndBootstrap();

    // 注册一键激活命令
    let bootstrapCmd = vscode.commands.registerCommand('hvaos.bootstrap', function () {
        runInteractiveWizard();
    });

    context.subscriptions.push(bootstrapCmd);
}

/**
 * 自动识别项目根目录是否有 .hvaos 芯片，若无则弹出气泡引导
 */
function autoDetectAndBootstrap() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return;

    const rootPath = workspaceFolders[0].uri.fsPath;
    const hvaosPath = path.join(rootPath, '.hvaos');

    // 如果未检测到 .hvaos 规则芯片，启动新手引导
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
        console.log('[HvAOS Socket] Rules chip found. Slot active.');
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
        prompt: '👉 [Q2/3] 有哪些文件或目录是 AI 绝对禁止触碰和修改的？(无硬性限制请直接回车)',
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
    console.log('[HvAOS Socket] VS Code rule socket deactivated.');
}

module.exports = {
    activate,
    deactivate
}
