import * as vscode from 'vscode';

// :::::::::::::::::::::: main function
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "custom-emmets" is now active!');

  let disposable = vscode.commands.registerCommand('custom-emmets.addAbbreviation', async () => {
    // :::::::::::::::::: Prompt user for abbreviation and expansion
    const abbreviation = await vscode.window.showInputBox({ prompt: 'Enter Emmet abbreviation' });
    const expansion = await vscode.window.showInputBox({ prompt: 'Enter Emmet expansion' });

    if (abbreviation && expansion) {
      // Retrieve existing abbreviations
      const config = vscode.workspace.getConfiguration('customEmmet');
      let abbreviations = config.get<string[]>('abbreviations') || [];

      // Add new abbreviation
      abbreviations.push(`${abbreviation}=${expansion}`);
      await config.update('abbreviations', abbreviations, vscode.ConfigurationTarget.Global);

      vscode.window.showInformationMessage(`Added Emmet abbreviation: ${abbreviation}`);
    } else {
      vscode.window.showErrorMessage('Abbreviation or expansion is missing.');
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
