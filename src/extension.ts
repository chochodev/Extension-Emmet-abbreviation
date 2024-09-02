import * as vscode from 'vscode';

// ::::::::::::::::::::::: main function
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "custom-emmets" is now active!');

  // ::::::::::::::::::::::::: Register the command
  let disposable = vscode.commands.registerCommand('custom-emmets.addAbbreviation', async () => {
    const abbreviation = await vscode.window.showInputBox({ prompt: 'Enter Emmet abbreviation' });
    const expansion = await vscode.window.showInputBox({ prompt: 'Enter Emmet expansion' });

    if (abbreviation && expansion) {
      const config = vscode.workspace.getConfiguration('customEmmet');
      let abbreviations = config.get<string[]>('abbreviations') || [];
      abbreviations.push(`${abbreviation}=${expansion}`);
      await config.update('abbreviations', abbreviations, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`Added Emmet abbreviation: ${abbreviation}`);
    } else {
      vscode.window.showErrorMessage('Abbreviation or expansion is missing.');
    }
  });

  context.subscriptions.push(disposable);

  // ::::::::::::::::::::::: Register the completion item provider
  const provider = vscode.languages.registerCompletionItemProvider(
    '*', // :::::::::::::: makes it language independent
    new CustomCompletionProvider(),
    ' ', // Trigger completion after a space (or any other character you want)
    '.', // Optionally use additional trigger characters
    '<', // Example of additional trigger characters
    '/'
  );

  context.subscriptions.push(provider);
}

export function deactivate() {}

class CustomCompletionProvider implements vscode.CompletionItemProvider {
  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): Promise<vscode.CompletionItem[]> {
    const config = vscode.workspace.getConfiguration('customEmmet');
    const abbreviations = config.get<string[]>('abbreviations') || [];
    
    const items = abbreviations.map(abbr => {
      const [prefix, body] = abbr.split('=');
      const item = new vscode.CompletionItem(prefix, vscode.CompletionItemKind.Snippet);
      item.insertText = new vscode.SnippetString(body);
      return item;
    });

    return items;
  }
}
