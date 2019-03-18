import * as vscode from 'vscode';
import * as path from 'path';

export function html(bookmarks: { [key: string]: string }, context: vscode.ExtensionContext): string {
	const bootstrapJsSrc = vscode.Uri.file(path.join(context.extensionPath, 'assets/js', 'bootstrap.min.js')).with({ scheme: 'vscode-resource' });
	const bootstrapCssSrc = vscode.Uri.file(path.join(context.extensionPath, 'assets/css', 'bootstrap.min.css')).with({ scheme: 'vscode-resource' });
	const jquerySrc = vscode.Uri.file(path.join(context.extensionPath, 'assets/js', 'jquery-3.3.1.slim.min.js')).with({ scheme: 'vscode-resource' });
	const popperSrc = vscode.Uri.file(path.join(context.extensionPath, 'assets/js', 'popper.min.js')).with({ scheme: 'vscode-resource' });

	let table: string = `<table class="table-dark table">
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">Name</th>
									<th scope="col">URL</th>
								</tr>
							</thead>
							<tbody>`;
	let i = 0;
	for (let key in bookmarks) {
		i++;
		table += `<tr><th scope="row">${i}</th>
					<td>${key}</td>
					<td><button type="button" class="btn btn-link btn-sm">${bookmarks[key]}</button></td></tr>`
	}
	table += `</tbody></table>`;

	return `
	<!DOCTYPE html>
	<html>
		<head>
			<link rel="stylesheet" href="${bootstrapCssSrc}">
			<script src="${bootstrapJsSrc}"></script>
			<script src="${jquerySrc}"></script>
			<script src="${popperSrc}"></script>
			<meta charset="UTF-8">
			<title>Web Bookmarks</title>
		</head>
		<body class="bg-dark">
			<div class="container">
				<div class="row">
					<div class="col">
						<div class="d-flex flex-row justify-content-center align-items-center">
							<h1 class="text-white">Web Booksmarks</h1>
							<button type="button" class="ml-2 btn btn-secondary" id="edit"> <svg
									xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
									<path
										d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
										fill="white" />
									<path d="M0 0h24v24H0z" fill="none" /></svg> </button>
						</div>
					</div>
				</div>
				<div class="row align-items-center justify-content-center">
					<div class="col-sm-12 col-lg-8">
						${table}
					</div>
				</div>
				<div class="row">
					<div class="col">
						<div class="d-flex flex-row justify-content-center align-items-center">
							<button type="button" class="btn btn-secondary" id="import">Import</button>
							<button type="button" class="btn btn-secondary ml-2" id="export">Export</button>
						</div>
					</div>
				</div>
			</div>
			<script>
				window.onload = function(){
					const vscode = acquireVsCodeApi();
					let link = document.querySelectorAll(".btn-link");
					for(let i of link){
						i.addEventListener('click', function(){
							vscode.postMessage({
								command: 'open',
								url: i.innerText
							});
						},false);
					}
					let edit = document.querySelector("#edit");
					edit.addEventListener('click',function(){
						vscode.postMessage({
							command: 'edit'
						},false);
					});
					let impbutton = document.querySelector("#import");
					impbutton.addEventListener('click', function(){
						vscode.postMessage({
							command: 'import'
						}, false);
					});
					let expbutton = document.querySelector("#export");
					expbutton.addEventListener('click', function(){
						vscode.postMessage({
							command: 'export'
						}, false);
					});
					
				}
			</script>
		</body>
	</html>`;
}