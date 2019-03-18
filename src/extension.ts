import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as indexView from './views/index';
import { BookmarkType } from './types';
const opn = require('opn');

const bookmarksFile: string = path.join(__dirname, 'bookmarks.json');

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "webbookmarks" is now active!');
	let disposable = vscode.commands.registerCommand('extension.openWebBookmarks', () => {
		let bookmarks: BookmarkType;
		if (!fs.existsSync(bookmarksFile)) {
			writeJSON({});
		}
		bookmarks = loadJSON(bookmarksFile);

		const panel = vscode.window.createWebviewPanel('webBookmarks', 'Web Bookmarks', vscode.ViewColumn.One, {
			enableScripts: true,
			localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'assets'))]
		});
		panel.webview.html = indexView.html(bookmarks, context);

		panel.webview.onDidReceiveMessage(async message => {
			switch (message.command) {
				case 'open':
					vscode.window.showInformationMessage('Abriendo Navegador...');
					opn(message.url);
					return;
				case 'edit':
					vscode.window.showInformationMessage('Abriendo Archivo de Configuracion...');
					vscode.window.showTextDocument(vscode.Uri.file(bookmarksFile));
					return;
				case 'import':
					let file: vscode.Uri[] | undefined = await vscode.window.showOpenDialog({ canSelectFiles: true, canSelectFolders: false, canSelectMany: false });
					let path = (file as vscode.Uri[])[0].path;
					let content = JSON.parse(fs.readFileSync(path, 'utf-8'));
					writeJSON(content);
					bookmarks = loadJSON(bookmarksFile);
					refresh(context, panel, bookmarks);
					vscode.window.showInformationMessage('Archivo importado correctamente');

			}
		}, undefined, context.subscriptions)
	});

	context.subscriptions.push(disposable);
}

function loadJSON(filePath: string) {
	return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function writeJSON(data: Object) {
	fs.writeFileSync(bookmarksFile, JSON.stringify(data));
}

function refresh(context: vscode.ExtensionContext, panel: vscode.WebviewPanel, bookmarks: BookmarkType) {
	panel.webview.html = indexView.html(bookmarks, context);
}

export function deactivate() { }