# Change Log

All notable changes to the "broo-language" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.1]

- Initial release

## [1.0.3]

- Fixed bug with opening and closing tags
- Added "pipeStrings" (matches eg. "|Some value|")

## [1.0.3]

- Added missing "ge", "le" operators
- Added keyword "break"
- Treat '' and "" both as strings (Not sure how Broo works)
- Improve variable detection

# [1.0.4]

- Improve variable detection
- Better function name detection

# [1.0.5]

- Fix single line comments
- Fix script tag children inheriting script tag's color
- Root of variable path will be highlighted differently (eg. "my.var.path", "my" will be colored differently)

# [1.0.6]
- < and > in tags will not be colored
- Remove coloring of operators for better clarity (gt, ne, eg, lt, le, ge, ->, ||, ??, |, ?)
