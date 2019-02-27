import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
const opn = require('opn');


export function activate(context: vscode.ExtensionContext) {
	const bookmarksFile: string = path.join(__dirname, 'bookmarks.json');
	console.log(bookmarksFile)
	console.log('Congratulations, your extension "webbookmarks" is now active!');
	let disposable = vscode.commands.registerCommand('extension.openWebBookmarks', () => {
		let bookmarks: { [key: string]: string };
		if (!fs.existsSync(bookmarksFile)) {
			fs.writeFileSync(bookmarksFile, "{}");
		}
		bookmarks = JSON.parse(fs.readFileSync(bookmarksFile, 'utf8'));

		const panel = vscode.window.createWebviewPanel('webBookmarks', 'Web Bookmarks', vscode.ViewColumn.One, {
			enableScripts: true
		});
		panel.webview.html = indexHtml(bookmarks);

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

function indexHtml(bookmarks: { [key: string]: string }): string {
	let table: string = "<table>";
	for (let key in bookmarks) {
		table += `<tr><td>${key}</td><td><button class="link" value="${bookmarks[key]}">Enlace</button></td></tr>`;
	}
	table += "</table>";
	return `
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8">
			<title>Web Bookmarks</title>
		</head>
		<body>
			<h1> Web Booksmarks </h1>
			<button id="edit"> Edit </button>
			${table}

			<script>
				window.onload = function(){
					const vscode = acquireVsCodeApi();
					let link = document.querySelectorAll(".link");
					for(let i of link){
						i.addEventListener('click', function(){
							vscode.postMessage({
								command: 'open',
								url: i.value
							});
						},false);
					}
					let edit = document.querySelector("#edit");
					edit.addEventListener('click',function(){
						vscode.postMessage({
							command: 'edit'
						},false);
					})
				}
			</script>
			<style>
				table, th, td {
					border: 1px solid black;
					border-collapse: collapse;
				}
    		</style>
		</body>
	</html>`;

}
