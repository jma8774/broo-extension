"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const definition_provider_1 = require("./providers/definition_provider");
const workspace_symbol_provider_1 = require("./providers/workspace_symbol_provider");
const indexer_1 = require("./indexer");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
async function activate(context) {
    console.log('Yay, extension "broo-language" is now active!');
    // Indexer
    const indexer = new indexer_1.Indexer();
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
    const definitionProvider = vscode.languages.registerDefinitionProvider({ language: "broo" }, new definition_provider_1.default(indexer));
    context.subscriptions.push(definitionProvider);
    // Symbol provider (Ctrl + T to search symbols)
    const symbolProvider = vscode.languages.registerWorkspaceSymbolProvider(new workspace_symbol_provider_1.default(indexer));
    context.subscriptions.push(symbolProvider);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map