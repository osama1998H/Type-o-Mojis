import * as vscode from 'vscode';

export function createSymbolDecoration(): vscode.TextEditorDecorationType {
  return vscode.window.createTextEditorDecorationType({
    fontStyle: 'bold',
    textDecoration: ';font-size:1.5em', // Add any additional styles you want to apply to the symbols
  });
}

export function insertEmoji(editor: vscode.TextEditor, emoji: string, symbolDecoration: vscode.TextEditorDecorationType) {
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
