import * as vscode from 'vscode';
import { createSymbolDecoration, insertEmoji, removeEmoji } from './insertEmoji';
import { getRandomEmoji } from './emojis';

let typingTimer: NodeJS.Timeout;
let lastLineAdded = -1;
let symbolDecoration: vscode.TextEditorDecorationType;

export function activate(context: vscode.ExtensionContext) {
  symbolDecoration = createSymbolDecoration();

  let disposable = vscode.commands.registerCommand('type-o-mojis.showRandomEmoji', () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      const currentPosition = activeEditor.selection.active;
      const endOfLine = activeEditor.document.lineAt(currentPosition.line).range.end;
      insertEmoji(getRandomEmoji(), activeEditor, symbolDecoration, currentPosition, endOfLine);
    }
  });

  context.subscriptions.push(disposable);

  let textChangeDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor || activeEditor.document !== event.document) {
      return;
    }

    const currentPosition = activeEditor.selection.active;
    const currentLine = currentPosition.line;

    if (currentLine !== lastLineAdded) {
      clearTimeout(typingTimer);
      removeEmoji(activeEditor, symbolDecoration);
      typingTimer = setTimeout(() => {
        if (event.contentChanges.length > 0) {
          const endOfLine = activeEditor.document.lineAt(currentLine).range.end;
          insertEmoji(getRandomEmoji(), activeEditor, symbolDecoration, currentPosition, endOfLine);
          lastLineAdded = currentLine;
        }
      }, 1000);
    }
  });

  context.subscriptions.push(textChangeDisposable);
}

export function deactivate() {
  clearTimeout(typingTimer);
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    removeEmoji(activeEditor, symbolDecoration);
  }
}
