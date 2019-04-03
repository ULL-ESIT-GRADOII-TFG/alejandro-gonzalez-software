import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as indexView from './views/index';
import { BookmarkType, JSONLoadError } from './types';
const opn = require('open');
export const i18n = require('i18n');

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "webbookmarks" is now active!');

	const bookmarksFile: string = path.join(__dirname, 'bookmarks.json');
	const language = vscode.workspace.getConfiguration('webbookmarks').language;

	i18n.configure({
		directory: path.join(context.extensionPath, 'locales')
	})

	i18n.setLocale(language);
	let panel: vscode.WebviewPanel;
	let disposable = vscode.commands.registerCommand('extension.openWebBookmarks', () => {
		try {
			const columnToShowIn = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
			if (panel) {
				panel.reveal(columnToShowIn);
			}
			else {
				let bookmarks: BookmarkType;
				if (!fs.existsSync(bookmarksFile)) {
					writeJSON({}, bookmarksFile);
				}
				bookmarks = loadJSON(bookmarksFile);

				panel = vscode.window.createWebviewPanel('webBookmarks', 'Web Bookmarks', vscode.ViewColumn.One, {
					enableScripts: true,
					localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'assets'))]
				});

				panel.webview.html = indexView.html(bookmarks, context);

				panel.webview.onDidReceiveMessage(async message => {
					switch (message.command) {
						case 'open':
							vscode.window.showInformationMessage(i18n.__('open'));
							opn(message.url);
							return;
						case 'edit':
							vscode.window.showInformationMessage(i18n.__('edit'));
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
								vscode.window.showInformationMessage(i18n.__('import'));
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
							vscode.window.showInformationMessage(i18n.__('export'));
							return;
						}
					}
				}, undefined, context.subscriptions)

				panel.onDidChangeViewState(e => {
					try {
						const panel = e.webviewPanel;
						bookmarks = loadJSON(bookmarksFile);
						refresh(context, panel, bookmarks);
					}
					catch (e) {
						if (e instanceof JSONLoadError) {
							vscode.window.showErrorMessage(e.message);
							vscode.window.showTextDocument(vscode.Uri.file(e.path));
						}
					}
				}, null, context.subscriptions);
			}
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
		throw new JSONLoadError(i18n.__('errorLoadJson'), filePath);
	}

}

function writeJSON(data: Object, filePath: string) {
	fs.writeFileSync(filePath, JSON.stringify(data));
}

function refresh(context: vscode.ExtensionContext, panel: vscode.WebviewPanel, bookmarks: BookmarkType) {
	panel.webview.html = indexView.html(bookmarks, context);
}

export function deactivate() { }