import * as vscode from 'vscode';

function createSymbolDecoration(): vscode.TextEditorDecorationType {
  return vscode.window.createTextEditorDecorationType({
    fontStyle: 'bold',
    textDecoration: ';font-size:1.5em', // Add any additional styles you want to apply to the symbols
  });
}

function insertEmoji(emoji: string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) { return; }

  const symbolDecoration = createSymbolDecoration();

  editor.edit((editBuilder) => {
    editBuilder.insert(editor.selection.active, emoji);
  }).then((success) => {
    if (success) {
      const currentPosition = editor.selection.active;
      const start = new vscode.Position(currentPosition.line, currentPosition.character - emoji.length);
      const end = new vscode.Position(currentPosition.line, currentPosition.character);
      const range = new vscode.Range(start, end);
      editor.setDecorations(symbolDecoration, [range]);
    }
  });
}

export function activate(context: vscode.ExtensionContext) {
  let symbolDecoration = createSymbolDecoration();

  let disposable = vscode.commands.registerCommand('type-o-mojis.showRandomEmoji', () => {
    insertEmoji('😎');
  });

  context.subscriptions.push(disposable);

  let textChangeDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor || activeEditor.document !== event.document) {
      return;
    }

    if (event.contentChanges.length > 0) {
      const change = event.contentChanges[0];
      if (change.text.length === 1) {
        insertEmoji('👍');
      }
    }
  });

  context.subscriptions.push(textChangeDisposable);

  if (vscode.window.activeTextEditor) {
    vscode.window.showInformationMessage('Type-o-Mojis is active!');
  }
}

export function deactivate() {}
