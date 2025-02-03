import * as vscode from 'vscode';
import Log from './logger';
import { Trie } from './trie';

interface KeywordLocation {
  file: string;
  line: number;
  character: number;
}


class Indexer {

  private symbolTrie: Trie;
  private keywordLocations: Map<string, KeywordLocation>;
  private documentKeywordLocations: Map<string, Map<string, KeywordLocation>>; // <document path, <keyword, location>>
  private counts = {
    macro: 0,
    style: 0,
    layerdrawable: 0,
    imagedrawable: 0,
    window: 0,
    globals: 0
  };

  public constructor() {
    this.keywordLocations = new Map<string, KeywordLocation>();
    this.documentKeywordLocations = new Map<string, Map<string, KeywordLocation>>();
    this.symbolTrie = new Trie();
  }

  private isValidFile(file: vscode.Uri) {
    return file.fsPath.endsWith('.broo');
  }

  private async findAllLanguageFiles() {
    const files = await vscode.workspace.findFiles('**/*.broo');
    return files;
  }

  private indexMacroLine(document: vscode.TextDocument, line: vscode.TextLine) {
    // Matches the word after "<macro name=" and between either single or double quotes
    const regex = /(?<=<macro name=['"]).*?(?=['"])/; 
    const match = line.text.match(regex);
    if (match) {
      this.counts.macro++;
      Log.debug("Found macro definition", match[0]);
      this.keywordLocations.set(match[0], {
        file: document.uri.fsPath,
        line: line.lineNumber,
        character: 0
      });
      return match[0];
    }
    return null;
  }

  private indexStyleLine(document: vscode.TextDocument, line: vscode.TextLine) {
    // Matches the word after "<style name=" and between either single or double quotes
    const regex = /(?<=<style name=['"]).*?(?=['"])/; 
    const match = line.text.match(regex);
    if (match) {
      this.counts.style++;
      Log.debug("Found style definition", match[0]);
      this.keywordLocations.set(match[0], {
        file: document.uri.fsPath,
        line: line.lineNumber,
        character: 0
      });
      return match[0];
    }
    return null;
  }

  private indexLayerdrawableLine(document: vscode.TextDocument, line: vscode.TextLine) {
    // Matches the word after "<layerdrawable name=" and between either single or double quotes
    const regex = /(?<=<layerdrawable name=['"]).*?(?=['"])/; 
    const match = line.text.match(regex);
    if (match) {
      this.counts.layerdrawable++;
      Log.debug("Found layerdrawable definition", match[0]);
      this.keywordLocations.set(match[0], {
        file: document.uri.fsPath,
        line: line.lineNumber,
        character: 0
      });
      return match[0];
    }
    return null;
  }

  private indexImagedrawableLine(document: vscode.TextDocument, line: vscode.TextLine) {
    // Matches the word after "<imagedrawable name=" and between either single or double quotes
    const regex = /(?<=<imagedrawable name=['"]).*?(?=['"])/; 
    const match = line.text.match(regex);
    if (match) {
      this.counts.imagedrawable++;
      Log.debug("Found imagedrawable definition", match[0]);
      this.keywordLocations.set(match[0], {
        file: document.uri.fsPath,
        line: line.lineNumber,
        character: 0
      });
      return match[0];
    }
    return null;
  }

  private indexWindowLine(document: vscode.TextDocument, line: vscode.TextLine) {
    // Matches the word after "<window name=" and between either single or double quotes
    const regex = /(?<=<window name=['"]).*?(?=['"])/; 
    const match = line.text.match(regex);
    if (match) {
      this.counts.window++;
      Log.debug("Found window definition", match[0]);
      this.keywordLocations.set(match[0], {
        file: document.uri.fsPath,
        line: line.lineNumber,
        character: 0
      });
      return match[0];
    }
    return null;
  }

  private indexGlobalVariableLine(document: vscode.TextDocument, line: vscode.TextLine) {
    // Matches the word after "var " or "equation "
    const regex = /(?:var|equation)\s+([a-zA-Z_][a-zA-Z0-9_]*)/;
    const match = line.text.match(regex);
    if (match) {
      this.counts.globals++;
      Log.debug("Found global definition", match[1]);
      this.keywordLocations.set(match[1], {
        file: document.uri.fsPath,
        line: line.lineNumber,
        character: 0
      });
      return match[1];
    }
    return null;
  }

  private indexLocalVariableLine(document: vscode.TextDocument, line: vscode.TextLine) {
    // Matches the word after "var " or "equation " but only in the current page
    const regex = /(?:var|equation)\s+([a-zA-Z_][a-zA-Z0-9_]*)/;
    const match = line.text.match(regex);
    if (match) {
      Log.debug("Found local definition", match[1]);
      let filepath = document.uri.fsPath;
      if (!this.documentKeywordLocations.has(filepath)) {
        this.documentKeywordLocations.set(filepath, new Map<string, KeywordLocation>());
      }
      this.documentKeywordLocations.get(filepath)?.set(match[1], {
        file: filepath,
        line: line.lineNumber,
        character: 0
      });
      return match[1];
    }
    return null;
  }

  private indexFunctionLine(document: vscode.TextDocument, line: vscode.TextLine) {
    // Matches the word after "function" but only in the current page
    const regex = /(?:function)\s+([a-zA-Z_][a-zA-Z0-9_]*)/;
    const match = line.text.match(regex);
    if (match) {
      Log.debug("Found function definition", match[1]);
      let filepath = document.uri.fsPath;
      if (!this.documentKeywordLocations.has(filepath)) {
        this.documentKeywordLocations.set(filepath, new Map<string, KeywordLocation>());
      }
      this.documentKeywordLocations.get(filepath)?.set(match[1], {
        file: filepath,
        line: line.lineNumber,
        character: 0
      });
      return match[1];
    }
    return null;
  }

  public async indexDocument(document: vscode.TextDocument) {
    if (!this.isValidFile(document.uri)) {
      return;
    }
    Log.info("Indexing file: ", document.uri.fsPath);

    const symbols: (string|null)[] = [];

    for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
      const line = document.lineAt(lineNumber);
      const words = line.text.split(' ');
      for (let wordNumber = 0; wordNumber < words.length; wordNumber++) {
        let word = words[wordNumber];
        // Index macro definitions
        if (word.startsWith("<macro")) {
          symbols.push(this.indexMacroLine(document, line));
          continue;
        }

        // Index style definitions
        if (word.startsWith("<style")) {
          symbols.push(this.indexStyleLine(document, line));
          continue;
        }

        // Index layerdrawble definitions
        if (word.startsWith("<layerdrawable")) {
          symbols.push(this.indexLayerdrawableLine(document, line));
          continue;
        }

        // Index imagedrawable definitions
        if (word.startsWith("<imagedrawable")) {
          symbols.push(this.indexImagedrawableLine(document, line));
          continue;
        }

        // Index window definitions
        if (word.startsWith("<window")) {
          symbols.push(this.indexWindowLine(document, line));
          continue;
        }

        // Index global variable and equations (they are prefixed with a 'G', this may catch some false positives)
        if (wordNumber < words.length - 1 && (
          (word.startsWith("var") && words[wordNumber + 1].startsWith("G")) || 
          (word.startsWith("equation") && words[wordNumber + 1].startsWith("G"))
        )) {
          symbols.push(this.indexGlobalVariableLine(document, line));
          continue;
        }

        // Capture local variable and equations but only in the current page. Reason why is because many of the same variable names are used across pages, so limiting this to just the current
        // page will allow it to be more accurate with the go to definition feature.
        if (word.startsWith("var") || word.startsWith("equation")) {
          this.indexLocalVariableLine(document, line);
          continue;
        }

        // Capture local function but only in the current page. Reason why is because many of the same variable names are used across pages, so limiting this to just the current
        // page will allow it to be more accurate with the go to definition feature.
        if (word.startsWith("function")) {
          this.indexFunctionLine(document, line);
          continue;
        }

        // Etc...
      }
    }

    symbols.forEach(symbol => {
      if (!symbol) {
        return;
      }
      this.symbolTrie.insert(symbol, false);
    });
  }
  
  public async clear() {
    this.keywordLocations.clear();
    Array.from(this.documentKeywordLocations.keys()).forEach(key => {
      this.documentKeywordLocations.get(key)?.clear();
    });
    this.documentKeywordLocations.clear();
  }

  public async indexAll() {
    Log.info("Indexing all language files");
    this.counts = {
      macro: 0,
      style: 0,
      layerdrawable: 0,
      imagedrawable: 0,
      window: 0,
      globals: 0
    };
    const files = await this.findAllLanguageFiles();
    let tasks = [];
    for (const file of files) {
      const document = await vscode.workspace.openTextDocument(file);
      tasks.push(this.indexDocument(document));
    }
    await Promise.all(tasks);
    Log.info("Found", this.counts.macro, "macro definitions");
    Log.info("Found", this.counts.style, "style definitions");
    Log.info("Found", this.counts.layerdrawable, "layerdrawable definitions");
    Log.info("Found", this.counts.imagedrawable, "imagedrawable definitions");
    Log.info("Found", this.counts.window, "window definitions");
    Log.info("Found", this.counts.globals, "global variables and equations");
    Log.info("etc...");
    Log.info("Indexing complete");
  }

  public find(word: string): KeywordLocation | undefined {
    return this.keywordLocations.get(word);
  }

  public findInDocument(document: vscode.TextDocument, word: string): KeywordLocation | undefined {
    return this.documentKeywordLocations.get(document.uri.fsPath)?.get(word);
  }

  public trieSearch(word: string): string[] {
    // case insensitive search
    return Array.from(this.symbolTrie.search(word, false));
  }

}

export { Indexer, KeywordLocation };