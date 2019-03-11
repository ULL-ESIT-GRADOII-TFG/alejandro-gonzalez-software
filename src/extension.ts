import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as indexView from './views/index';
const opn = require('opn');

export function activate(context: vscode.ExtensionContext) {
	const bookmarksFile: string = path.join(__dirname, 'bookmarks.json');
	console.log('Congratulations, your extension "webbookmarks" is now active!');
	let disposable = vscode.commands.registerCommand('extension.openWebBookmarks', () => {
		let bookmarks: { [key: string]: string };
		if (!fs.existsSync(bookmarksFile)) {
			fs.writeFileSync(bookmarksFile, "{}");
		}
		bookmarks = JSON.parse(fs.readFileSync(bookmarksFile, 'utf8'));

		const panel = vscode.window.createWebviewPanel('webBookmarks', 'Web Bookmarks', vscode.ViewColumn.One, {
			enableScripts: true,
			localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'assets'))]
		});
		panel.webview.html = indexView.html(bookmarks, context);

		panel.webview.onDidReceiveMessage(message => {
			switch (message.command) {
				case 'open':
					vscode.window.showInformationMessage('Abriendo Navegador...');
					opn(message.url);
					return;
				case 'edit':
					vscode.window.showInformationMessage('Abriendo Archivo de Configuracion...');
					vscode.window.showTextDocument(vscode.Uri.file(bookmarksFile));
					return;
			}
		}, undefined, context.subscriptions)
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }