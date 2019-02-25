// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const opn = require('opn');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "webbookmarks" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.openWebBookmarks', function () {
		// The code you place here will be executed every time your command is executed
		let bookmarks = {
			"Google": "https://www.google.es",
			"Amazon": "https://www.amazon.es"
		}
		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World!');
		const panel = vscode.window.createWebviewPanel('webBookmarks', 'Web Bookmarks', vscode.ViewColumn.One, {
			enableScripts: true
		});
		panel.webview.html = constructHtml(bookmarks);

		panel.webview.onDidReceiveMessage(message => {
			switch (message.command) {
				case 'open':
					vscode.window.showInformationMessage('Abriendo Navegador...');
					console.log(message);
					opn(message.url);
					return;
			}
		}, undefined, context.subscriptions)
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
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
							console.log("click", i.value);
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
