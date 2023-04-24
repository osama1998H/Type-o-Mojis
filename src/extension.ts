import * as vscode from 'vscode';
import * as path from 'path';

let prevWordCount = 0;

function loadStyles(context: vscode.ExtensionContext) {
  const stylePath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'media', 'style.css'));
  const styleUri = stylePath.with({ scheme: 'vscode-resource' });
  const styleLink = `<link rel="stylesheet" type="text/css" href="${styleUri}"/>`;

  vscode.workspace.onDidOpenTextDocument((document) => {
    if (document.uri.scheme === 'file') {
      vscode.commands.executeCommand('editor.action.insertSnippet', { snippet: `${styleLink}` });
    }
  });
}


function countWords(text: string): number {
  const words = text.trim().split(/\s+/);
  return words.filter(word => word.length > 0).length;
}

function getTypingMetrics(document: vscode.TextDocument): { speed: number, continuity: number, wordCount: number } {
  // Implement logic to measure typing speed and continuity
  const wordCount = countWords(document.getText());
  // ... calculate speed and continuity as needed
  return { speed: 0, continuity: 0, wordCount }; // Use actual calculated values for speed and continuity
}

function getEncouragingSymbol(speed: number, continuity: number): string {
  const symbolsConfig = vscode.workspace.getConfiguration('type-o-mojis');
  const customSymbols = symbolsConfig.get<string[]>('customSymbols');

  const hourOfDay = new Date().getHours();
  let symbols = customSymbols;

  if (hourOfDay >= 6 && hourOfDay < 12) {
    // Morning symbols
    symbols = ["🌞", "🍳", "☕", "🌅"];
  } else if (hourOfDay >= 12 && hourOfDay < 18) {
    // Afternoon symbols
    symbols = ["🌤", "🍔", "🚴", "🏃"];
  } else if (hourOfDay >= 18 && hourOfDay < 22) {
    // Evening symbols
    symbols = ["🌙", "🍽", "📺", "💆‍♂️"];
  } else {
    // Night symbols
    symbols = ["🌚", "🦉", "🌃", "🛌"];
  }

  const index = Math.floor(Math.random() * symbols.length);
  return symbols[index];
}

export function activate(context: vscode.ExtensionContext) {
  loadStyles(context);
  vscode.workspace.onDidChangeTextDocument((event) => {
    const metrics = getTypingMetrics(event.document);
    const symbol = getEncouragingSymbol(metrics.speed, metrics.continuity);

    const wordInterval = 10;
    if (Math.floor(metrics.wordCount / wordInterval) > Math.floor(prevWordCount / wordInterval)) {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        editor.edit((editBuilder) => {
          const position = editor.selection.active;
          const symbolWithAnimation = `<span style="animation: fadeIn 1s, bounce 1s">${symbol}</span>`;
          editBuilder.insert(position, symbolWithAnimation);
        });

      }
    }

    prevWordCount = metrics.wordCount;
  });
}

export function deactivate() { }
