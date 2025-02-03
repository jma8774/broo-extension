import Log from './logger';

class TrieNode {
  children: { [key: string]: TrieNode };
  keyWords: Set<string>;
  isEnd: boolean;

  constructor() {
    this.children = {};
    this.keyWords = new Set();
    this.isEnd = false;
  }
}

class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  private insertHelper(word: string, symbol: string) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
      node.keyWords.add(symbol);
    }
    node.isEnd = true;
  }
  
  // We also want permutations(?) of these parts joined by a space in it's original order
  // For example: "text-regular-bold" would generate "text-regular-bold", "regular-bold" and "bold"
  // NOTE: VSCode symbol search only takes in 1 word, so spaces would not work
  private addOriginalPermutationsWithChar(words: Set<string>, parts: string[], charSep: string) {
    let joined = "";
    for (let i = 0; i < parts.length; i++) {
      for (let j = i; j < parts.length; j++) {
        joined += parts[j] + charSep;
      }
      joined = joined.trim();
      words.add(joined);
      joined = "";
    }
  }

  insert(word: string, caseSensitive: boolean) {
    // Symbol is the thing we are storing in the trie
    // Word is the the thing that creates the path to the symbol
    let symbol = word;
    if (!caseSensitive) {
      word = word.toLowerCase();
    }

    // Split the word into parts and insert each part into the trie
    const words: Set<string> = new Set();
    const wordsSplitByHyphen = word.split("-");
    const wordsSplitByUnderscore = word.split("_");
    words.add(word);
    wordsSplitByHyphen.forEach((w) => words.add(w));
    wordsSplitByUnderscore.forEach((w) => words.add(w));
    this.addOriginalPermutationsWithChar(words, wordsSplitByHyphen, "-");
    this.addOriginalPermutationsWithChar(words, wordsSplitByUnderscore, "_");

    // Insert into Trie
    words.forEach((w) => this.insertHelper(w, symbol));
  }

  search(word: string, caseSensitive: boolean) {
    // Word is the the thing that creates the path to the symbol
    if (!caseSensitive) {
      word = word.toLowerCase();
    }

    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!node.children[char]) {
        return [];
      }
      node = node.children[char];
    }
    return node.keyWords;
  }
}

export { Trie, TrieNode };