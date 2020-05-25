import * as vscode from 'vscode';

export class snippetsProvider implements vscode.CompletionItemProvider {

    tips: string = '';
    snippets: string = '';

	constructor(tips: string, snippets : string) {
        this.tips = tips;
        this.snippets = snippets;
	}

	provideCompletionItems (
	  document: vscode.TextDocument,
	  position: vscode.Position
	): Thenable<vscode.CompletionItem[]> {
	  return new Promise((resolve, reject) => {
		const item = new vscode.CompletionItem(`FECONFIG => ${this.tips}`, vscode.CompletionItemKind.Snippet);
		item.insertText = this.snippets;
		return resolve([item]);
	  });
	}
  
}