import * as vscode from 'vscode';
import * as path from 'path';

type Bookmark = string;

interface Folder {
	[key: string]: Bookmark | Folder
}

export function html(bookmarks: Folder, context: vscode.ExtensionContext): string {
	const bootstrapJsSrc = vscode.Uri.file(path.join(context.extensionPath, 'assets/js', 'bootstrap.min.js')).with({ scheme: 'vscode-resource' });
	const bootstrapCssSrc = vscode.Uri.file(path.join(context.extensionPath, 'assets/css', 'bootstrap.min.css')).with({ scheme: 'vscode-resource' });
	const jquerySrc = vscode.Uri.file(path.join(context.extensionPath, 'assets/js', 'jquery-3.3.1.slim.min.js')).with({ scheme: 'vscode-resource' });
	const popperSrc = vscode.Uri.file(path.join(context.extensionPath, 'assets/js', 'popper.min.js')).with({ scheme: 'vscode-resource' });

	let table: string = recursiveExplore(bookmarks);

	return `
	<!DOCTYPE html>
	<html>
		<head>
			<link rel="stylesheet" href="${bootstrapCssSrc}">
			<script src="${jquerySrc}"></script>
			<script src="${popperSrc}"></script>
			<script src="${bootstrapJsSrc}"></script>
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
				<div class="row">
					<div class="col">
						<div class="d-flex flex-row justify-content-center align-items-center">
							<button type="button" class="btn btn-secondary" id="import">Import</button>
							<button type="button" class="btn btn-secondary ml-2" id="export">Export</button>
						</div>
					</div>
				</div>
				<div class="row align-items-center justify-content-center">
					<div class="col-sm-12 col-lg-10">
						${table}
					</div>
				</div>
			</div>
			<script>
				window.onload = function(){
					const vscode = acquireVsCodeApi();
					let link = document.querySelectorAll(".bookmark");
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


let level = 0;
function recursiveExplore(data: Folder) {
	console.log("llamada a recursive");
	let table = "";
	for (const [key, value] of Object.entries(data)) {
		if (typeof (value as Bookmark) == 'string') {
			console.log("bookmark");
			table += `
        		<ul class="mt-2 mb-2 list-group list-group-horizontal text-white">
				  	<li class="col-3 d-flex align-items-center justify-content-center list-group-item bg-secondary">${key}</li>
					<li class="list-group-item bg-secondary flex-fill"><button class="btn btn-link bookmark text-primary">${value}</button></li>
				</ul>`;
		}
		else {
			console.log("folder");
			level++;
			let dummy = recursiveExplore(value as Folder);
			table += `
				<div class="accordion mb-2" id="accordion-${level}-${key}">
					<div class="card rounded bg-secondary text-white">
						<div class="card-header" id="header-${level}-${key}">
							<h3 style="cursor:pointer;" data-toggle="collapse" data-target="#folder-${level}-${key}" aria-expanded="true" aria-controls="#folder-${level}-${key}">
          						${key}
        					</h3>
            				<h3 style="cursor:pointer;" data-toggle="collapse" data-target="#folder--${level}-${key}"></h3>
        				</div>
        				<div id="folder-${level}-${key}" class="collapse" data-parent="#accordion-${level}-${key}">
							<div class="card-body">
						  		${dummy}
							</div>
        				</div>
    				</div>
        		</div>`;
		}
	}
	return table;
}