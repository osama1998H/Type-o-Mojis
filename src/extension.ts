import * as vscode from 'vscode';

function createSymbolDecoration(): vscode.TextEditorDecorationType {
  return vscode.window.createTextEditorDecorationType({
    fontStyle: 'bold',
    textDecoration: ';font-size:1.5em',
  });
}

function insertEmoji(emoji: string, editor: vscode.TextEditor) {
  const symbolDecoration = createSymbolDecoration();

  const currentPosition = editor.selection.active;
  const line = currentPosition.line;
  const endOfLine = editor.document.lineAt(line).range.end;

  editor.edit((editBuilder) => {
    editBuilder.insert(endOfLine, emoji);
  }).then((success) => {
    if (success) {
      const newPosition = editor.selection.active;
      const start = new vscode.Position(newPosition.line, newPosition.character - emoji.length);
      const end = new vscode.Position(newPosition.line, newPosition.character);
      const range = new vscode.Range(start, end);
      editor.setDecorations(symbolDecoration, [range]);
      emojiPosition = newPosition;
    }
  });
}

function removeEmoji(editor: vscode.TextEditor) {
  if (emojiPosition) {
    const start = new vscode.Position(emojiPosition.line, emojiPosition.character - 1);
    const end = emojiPosition;
    editor.edit((editBuilder) => {
      editBuilder.delete(new vscode.Range(start, end));
    });
    emojiPosition = null;
  }
}

const emojis = ['🙂', '🧠', '😎', '👌', '💯', '🔥', '✌️', '✅', '📊', '🚀'];

function getRandomEmoji(): string {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

let typingTimer: NodeJS.Timeout;
let lastLineAdded = -1;
let emojiPosition: vscode.Position | null = null;

export function activate(context: vscode.ExtensionContext) {
  let symbolDecoration = createSymbolDecoration();

  let disposable = vscode.commands.registerCommand('type-o-mojis.showRandomEmoji', () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      insertEmoji(getRandomEmoji(), activeEditor);
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
      typingTimer = setTimeout(() => {
        if (event.contentChanges.length > 0) {
          insertEmoji(getRandomEmoji(), activeEditor);
          lastLineAdded = currentLine;
        }
      }, 1000);
    } else {
      removeEmoji(activeEditor);
    }
  });

  context.subscriptions.push(textChangeDisposable);
}

export function deactivate() {}
