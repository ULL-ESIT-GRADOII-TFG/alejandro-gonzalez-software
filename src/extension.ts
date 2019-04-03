import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as indexView from './views/index';
import { BookmarkType, JSONLoadError } from './types';
const opn = require('open');

const bookmarksFile: string = path.join(__dirname, 'bookmarks.json');

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "webbookmarks" is now active!');
	let disposable = vscode.commands.registerCommand('extension.openWebBookmarks', () => {
		try {
			let bookmarks: BookmarkType;
			if (!fs.existsSync(bookmarksFile)) {
				writeJSON({}, bookmarksFile);
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
					case 'import': {
						try {
							let file: vscode.Uri[] | undefined = await vscode.window.showOpenDialog({
								canSelectFiles: true, canSelectFolders: false, canSelectMany: false, filters: {
									"JSON (.json)": ["json"]
								}
							});
							let content = loadJSON((file as vscode.Uri[])[0].fsPath)
							writeJSON(content, bookmarksFile);
							bookmarks = content;
							refresh(context, panel, bookmarks);
							vscode.window.showInformationMessage('Archivo importado correctamente');
							return;
						}
						catch (e) {
							if (e instanceof JSONLoadError) {
								vscode.window.showErrorMessage(e.message);
								vscode.window.showTextDocument(vscode.Uri.file(e.path));
							}
							return;
						}
					}
					case 'export': {
						let file: vscode.Uri | undefined = await vscode.window.showSaveDialog({
							filters: {
								"JSON (.json)": ["json"]
							}
						})
						writeJSON(bookmarks, (file as vscode.Uri).fsPath)
						vscode.window.showInformationMessage('Archivo exportado correctamente');
						return;
					}
				}
			}, undefined, context.subscriptions)

		}
		catch (e) {
			if (e instanceof JSONLoadError) {
				vscode.window.showErrorMessage(e.message);
				vscode.window.showTextDocument(vscode.Uri.file(e.path));
			}
		}
	});

	context.subscriptions.push(disposable);
}

function loadJSON(filePath: string) {
	try {
		let json = JSON.parse(fs.readFileSync(filePath, 'utf8'))
		return json;
	}
	catch (err) {
		throw new JSONLoadError("Archivo JSON Invalido", filePath);
	}

}

function writeJSON(data: Object, filePath: string) {
	fs.writeFileSync(filePath, JSON.stringify(data));
}

function refresh(context: vscode.ExtensionContext, panel: vscode.WebviewPanel, bookmarks: BookmarkType) {
	panel.webview.html = indexView.html(bookmarks, context);
}

export function deactivate() { }