import * as vscode from 'vscode';
import * as path from 'path';

let prevWordCount = 0;

function createSymbolDecoration(): vscode.TextEditorDecorationType {
  return vscode.window.createTextEditorDecorationType({
    fontStyle: 'bold',
    textDecoration: ';font-size:1.5em', // Add any additional styles you want to apply to the symbols
  });
}

function insertEmoji(emoji: string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {return;}

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
  let symbolDecoration = createSymbolDecoration();
  vscode.workspace.onDidChangeTextDocument((event) => {
    const metrics = getTypingMetrics(event.document);
    const symbol = getEncouragingSymbol(metrics.speed, metrics.continuity);

    const wordInterval = 10;
    if (Math.floor(metrics.wordCount / wordInterval) > Math.floor(prevWordCount / wordInterval)) {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        insertEmoji(symbol);

      }
    }

    prevWordCount = metrics.wordCount;
  });
}

export function deactivate() { }
