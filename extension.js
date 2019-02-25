const vscode = require('vscode');
const opn = require('opn');
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "webbookmarks" is now active!');
	let disposable = vscode.commands.registerCommand('extension.openWebBookmarks', function () {
		let bookmarks = {
			"Google": "https://www.google.es",
			"Amazon": "https://www.amazon.es"
		}

		const panel = vscode.window.createWebviewPanel('webBookmarks', 'Web Bookmarks', vscode.ViewColumn.One, {
			enableScripts: true
		});
		panel.webview.html = constructHtml(bookmarks);

		panel.webview.onDidReceiveMessage(message => {
			switch (message.command) {
				case 'open':
					vscode.window.showInformationMessage('Abriendo Navegador...');
					opn(message.url);
					return;
			}
		}, undefined, context.subscriptions)
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() { }

function constructHtml(bookmarks) {
	let table = "<table>";
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
			<h1 id="h1"> Hello World </h1>
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
				}
			</script>
		</body>
	</html>`;
}

module.exports = {
	activate,
	deactivate
}
