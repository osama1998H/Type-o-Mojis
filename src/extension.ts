import * as vscode from 'vscode';
import { createSymbolDecoration, insertEmoji } from './insertEmoji';
import { resetTypingStreak, increaseTypingStreak, getStreakReward } from './typingStreak';

export function activate(context: vscode.ExtensionContext) {
  let symbolDecoration = createSymbolDecoration();

  let disposable = vscode.commands.registerCommand('type-o-mojis.showRandomEmoji', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    insertEmoji(editor, '😎', symbolDecoration);
  });

  context.subscriptions.push(disposable);

  let textChangeDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    if (event.contentChanges.length > 0) {
      const change = event.contentChanges[0];
      if (change.text.length === 1) {
        if (change.text === ' ' || change.text === '\n' || change.text === '\t') {
          resetTypingStreak();
        } else {
          increaseTypingStreak();
          const streakReward = getStreakReward();
          if (streakReward) {
            insertEmoji(editor, streakReward, symbolDecoration);
          } else {
            insertEmoji(editor, '👍', symbolDecoration);
          }
        }
      }
    }
  });

  context.subscriptions.push(textChangeDisposable);
}

export function deactivate() {}
