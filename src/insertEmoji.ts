import * as vscode from 'vscode';

export function createSymbolDecoration(): vscode.TextEditorDecorationType {
  return vscode.window.createTextEditorDecorationType({
    fontStyle: 'bold',
    textDecoration: ';font-size:1.5em',
  });
}

export function insertEmoji(emoji: string, editor: vscode.TextEditor, symbolDecoration: vscode.TextEditorDecorationType, startPosition: vscode.Position, endPosition: vscode.Position) {
  editor.setDecorations(symbolDecoration, [{ range: new vscode.Range(startPosition, endPosition), renderOptions: { after: { contentText: emoji }}}]);
}

export function removeEmoji(editor: vscode.TextEditor, symbolDecoration: vscode.TextEditorDecorationType) {
  editor.setDecorations(symbolDecoration, []);
}
