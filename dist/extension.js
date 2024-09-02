"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var keyValueStore = {};
function activate(context) {
  console.log('Congratulations, your extension "vscode-key-expander" is now active!');
  let storeKeyValueDisposable = vscode.commands.registerCommand("vscode-key-expander.storeKeyValue", async () => {
    const key = await vscode.window.showInputBox({ prompt: "Enter the key (without !)" });
    if (key) {
      const value = await vscode.window.showInputBox({ prompt: "Enter the value" });
      if (value) {
        keyValueStore[key] = value;
        vscode.window.showInformationMessage(`Stored: !${key} = ${value}`);
      }
    }
  });
  let expandDisposable = vscode.commands.registerCommand("vscode-key-expander.expand", async () => {
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
      await editor.edit((editBuilder) => {
        editBuilder.insert(selection.start, "\n");
      });
    }
  });
  context.subscriptions.push(storeKeyValueDisposable, expandDisposable);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
