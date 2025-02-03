# Language Extension for Broo


### How to Use

Change the langugage mode to Broo on the bottom right of VSCode (should happen automatically).

### Where do I get it?
Published to the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=jma8774.broo-language).

### Features
* Syntax highlighting
* Go to definition (Ctrl + Click or by pressing F12 on a symbol)
  * Some things to note about the "Go to definition" implementation is that the extension has no knowledge about the hierachy of the code and the scope of where certain functions and variables may live. This is why "Go to definition" for functions and variables only searches from within the current page
* Symbol search (Ctrl + T)
  * All supported symbol definitions that have been indexed can be searched for with this command, allowing you to traverse the code base faster 

### How do I run and develope the extension locally?
Follow the [guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#vsce) on how to use `vsce` to generate a `.vsix` file.
1. Run `npm run package` to generate the `.vsix` file
2. In VSCode, under the extensions tab, install the `.vsix` extension by clicking "Install from VSIX"

### Disclaimer
It is not going to work 100% of the time because there will be edge cases that this simple syntax highlighter will not account for but it is good enough for the effort spent
