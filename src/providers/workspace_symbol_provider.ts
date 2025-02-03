import * as vscode from 'vscode';
import { Indexer } from '../indexer';
import Log from '../logger';

export default class WorkspaceSymbolProvider implements vscode.WorkspaceSymbolProvider {

  private indexer: Indexer;
  public constructor(indexer: Indexer) {
    this.indexer = indexer;
  }

  provideWorkspaceSymbols(query: string, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[]> {
      Log.info("provideWorkspaceSymbols called with query", query);
      const symbols: vscode.SymbolInformation[] = [];

      var matches = this.indexer.trieSearch(query);

      if (matches.length > 0) {
        matches.forEach(match => {
          var keywordlocation = this.indexer.find(match);
          if (!keywordlocation) {
            return;
          }
          symbols.push(new vscode.SymbolInformation(match, vscode.SymbolKind.Function, query, new vscode.Location(vscode.Uri.file(keywordlocation.file), new vscode.Position(keywordlocation.line, keywordlocation.character))));
        });
      }

      return symbols;
  }
}