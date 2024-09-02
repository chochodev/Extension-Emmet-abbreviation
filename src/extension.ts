import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('vscode-emmet-expander.expand', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const document = editor.document;
        const selection = editor.selection;
        const line = document.lineAt(selection.start.line);
        const lineText = line.text.substring(0, selection.start.character);

        const config = vscode.workspace.getConfiguration('emmetExpander');
        const abbreviations = config.get<{ [key: string]: string }>('abbreviations', {});

        for (const [abbr, expansion] of Object.entries(abbreviations)) {
            if (lineText.endsWith(abbr)) {
                const expansionText = await getExpansionText(expansion);
                if (expansionText) {
                    await editor.edit((editBuilder) => {
                        const start = new vscode.Position(selection.start.line, selection.start.character - abbr.length);
                        const end = selection.start;
                        editBuilder.replace(new vscode.Range(start, end), expansionText);
                    });
                    return;
                }
            }
        }
    });

    context.subscriptions.push(disposable);
}

async function getExpansionText(expansion: string): Promise<string | null> {
    if (expansion.startsWith('github:')) {
        const [_, owner, repo, path] = expansion.split(':');
        const config = vscode.workspace.getConfiguration('emmetExpander');
        const token = config.get<string>('githubToken', '');

        if (!token) {
            vscode.window.showErrorMessage('GitHub token is not set. Please set it in the extension settings.');
            return null;
        }

        try {
            const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3.raw'
                }
            });
            return response.data;
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to fetch GitHub file: ${error.message}`);
            return null;
        }
    } else {
        return expansion;
    }
}

export function deactivate() {}