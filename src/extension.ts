import * as vscode from 'vscode';

let keyValueStore: { [key: string]: string } = {};

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "vscode-key-expander" is now active!');

    let storeKeyValueDisposable = vscode.commands.registerCommand('vscode-key-expander.storeKeyValue', async () => {
        const key = await vscode.window.showInputBox({ prompt: 'Enter the key (without !)' });
        if (key) {
            const value = await vscode.window.showInputBox({ prompt: 'Enter the value' });
            if (value) {
                keyValueStore[key] = value;
                vscode.window.showInformationMessage(`Stored: !${key} = ${value}`);
            }
        }
    });

    let expandDisposable = vscode.commands.registerCommand('vscode-key-expander.expand', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const line = document.lineAt(selection.start.line);
            const lineText = line.text.substring(0, selection.start.character);

            for (const [key, value] of Object.entries(keyValueStore)) {
                if (lineText.endsWith(`!${key}`)) {
                    await editor.edit((editBuilder) => {
                        const start = new vscode.Position(selection.start.line, selection.start.character - key.length - 1);
                        const end = selection.start;
                        editBuilder.replace(new vscode.Range(start, end), value);
                    });
                    return;
                }
            }

            // If no key was expanded, insert a newline
            await editor.edit((editBuilder) => {
                editBuilder.insert(selection.start, '\n');
            });
        }
    });

    context.subscriptions.push(storeKeyValueDisposable, expandDisposable);
}

export function deactivate() {}