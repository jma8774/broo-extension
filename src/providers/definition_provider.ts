import * as vscode from 'vscode';
import { Indexer, KeywordLocation } from '../indexer';
import Log from '../logger';

export default class DefinitionProvider implements vscode.DefinitionProvider {
    private indexer: Indexer;

    public constructor(indexer: Indexer) {
        this.indexer = indexer;
    }

    provideDefinition(
        document: vscode.TextDocument, 
        position: vscode.Position, 
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Definition> {
        Log.info("provideDefinition called");
        // Your logic to find the definition
        const word = document.getText(document.getWordRangeAtPosition(position));
        const location = this.findDefinition(document, word);

        if (location) {
            Log.info(`Definition found at ${location}`);
            return new vscode.Location(
                vscode.Uri.file(location.file),
                new vscode.Position(location.line, location.character)
            );
        }

        return null;
    }

    private findDefinition(document: vscode.TextDocument, word: string): KeywordLocation | undefined {
        var globalfind = this.indexer.find(word);
        if (globalfind) {
            return globalfind;
        }

        return this.indexer.findInDocument(document, word);
    }
}

