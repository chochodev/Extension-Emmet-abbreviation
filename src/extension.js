const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
  let disposable = vscode.commands.registerCommand('customSnippets.addSnippet', async function () {
    // Prompt for snippet language
    const language = await vscode.window.showInputBox({
      prompt: "Enter the language for the snippet (e.g., javascript, python)"
    });

    if (!language) {
      vscode.window.showErrorMessage('Snippet creation cancelled, language is required.');
      return;
    }

    // Prompt for snippet prefix
    const prefix = await vscode.window.showInputBox({
      prompt: "Enter the prefix for the snippet"
    });

    if (!prefix) {
      vscode.window.showErrorMessage('Snippet creation cancelled, prefix is required.');
      return;
    }

    // Prompt for snippet body
    const body = await vscode.window.showInputBox({
      prompt: "Enter the code body for the snippet",
      value: "function ${1:functionName}(${2:params}) {\n\t${3:// body}\n}"
    });

    if (!body) {
      vscode.window.showErrorMessage('Snippet creation cancelled, body is required.');
      return;
    }

    // Construct the snippet object
    const snippet = {
      [prefix]: {
        "prefix": prefix,
        "body": body.split('\n'),
        "description": `Custom snippet for ${language}`
      }
    };

    // Path to the snippets JSON file
    const snippetsFilePath = path.join(__dirname, 'snippets', `${language}.code-snippets`);

    // Read existing snippets file or create a new one
    let snippets = {};
    if (fs.existsSync(snippetsFilePath)) {
      const fileContent = fs.readFileSync(snippetsFilePath, 'utf8');
      snippets = JSON.parse(fileContent);
    }

    // Add the new snippet
    Object.assign(snippets, snippet);

    // Write back to the file
    fs.writeFileSync(snippetsFilePath, JSON.stringify(snippets, null, 2));

    vscode.window.showInformationMessage(`Snippet added for ${language}!`);
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
