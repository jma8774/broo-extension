// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import DefinitionProvider from './providers/definition_provider';
import SymbolProvider from './providers/workspace_symbol_provider';
import { Indexer } from './indexer';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	console.log('Yay, extension "broo-language" is now active!');

	// Indexer
	const indexer = new Indexer();
	indexer.clear(); 
	await indexer.indexAll();

	// Index all every 5 minutes
	setInterval(async () => {
		indexer.clear();
		await indexer.indexAll();
	}, 60000 * 5);

	// Index specific file on change
	vscode.workspace.onDidChangeTextDocument(async (event) => {
    // Clear the cache or re-index affected file
		const changedDocument = event.document;
    await indexer.indexDocument(changedDocument);
	});

	// "Go to definition" provider (Ctrl + Click a symbol or press F12)
	const definitionProvider = vscode.languages.registerDefinitionProvider(
		{ language: "broo" },
		new DefinitionProvider(indexer)
	);
	context.subscriptions.push(definitionProvider);

	// Symbol provider (Ctrl + T to search symbols)
	const symbolProvider = vscode.languages.registerWorkspaceSymbolProvider(
		new SymbolProvider(indexer)
	);
	context.subscriptions.push(symbolProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
