import * as vscode from 'vscode';

function createSymbolDecoration(): vscode.TextEditorDecorationType {
  return vscode.window.createTextEditorDecorationType({
    fontStyle: 'bold',
    textDecoration: ';font-size:1.5em',
  });
}

function insertEmoji(emoji: string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) { return; }

  const symbolDecoration = createSymbolDecoration();

  editor.edit((editBuilder) => {
    const currentPosition = editor.selection.active;
    const line = currentPosition.line;
    const endOfLine = editor.document.lineAt(line).range.end;
    editBuilder.insert(endOfLine, emoji);
  }).then((success) => {
    if (success) {
      const currentPosition = editor.selection.active;
      const start = new vscode.Position(currentPosition.line, currentPosition.character - emoji.length);
      const end = new vscode.Position(currentPosition.line, currentPosition.character);
      const range = new vscode.Range(start, end);
      editor.setDecorations(symbolDecoration, [range]);

      setTimeout(() => {
        editor.setDecorations(symbolDecoration, []);
      }, 3000);
    }
  });
}

const emojis = ['🙂', '🧠', '😎', '👌', '💯', '🔥', '✌️', '✅', '📊', '🚀'];

function getRandomEmoji(): string {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

let typingTimer: NodeJS.Timeout;

export function activate(context: vscode.ExtensionContext) {
  let symbolDecoration = createSymbolDecoration();

  let disposable = vscode.commands.registerCommand('type-o-mojis.showRandomEmoji', () => {
    insertEmoji(getRandomEmoji());
  });

  context.subscriptions.push(disposable);

  let textChangeDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor || activeEditor.document !== event.document) {
      return;
    }

    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      insertEmoji(getRandomEmoji());
    }, 1000);
  });

  context.subscriptions.push(textChangeDisposable);
}

export function deactivate() {}
