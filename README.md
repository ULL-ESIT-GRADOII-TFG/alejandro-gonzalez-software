# Web Bookmarks Extension
[![Build Status](https://travis-ci.com/ULL-ESIT-GRADOII-TFG/alejandro-gonzalez-software.svg?token=PnidsgQLm74nYpn9BCGD&branch=master)](https://www.travis-ci.com/ULL-ESIT-GRADOII-TFG/alejandro-gonzalez-software)

Web Bookmarks allows you to keep your favourites websites inside the VSCODE environment. 

## Features

To execute the extension just open the vscode command palette and type <code>Open Web Bookmarks</code> and click to run. Alternatively you can run it pressing the shortcut available:

* Linux & Windows: <code>ctrl + shift + l</code>
* MacOS: <code>cmd + shift + l</code>

The bookmarks JSON has to match the next structure for the extension to work fully:

```json
{
    "bookmark name":"url",
    "folder name": { 
        ...
    }
}
```

The bookmarks are rendered in the same order as they are specified in the JSON. 

The folders can have nested folders too.

## Requirements

This extension is require vscode version ^1.31.0.

## Extension Settings

- You can change the language of the extension, currently only Spanish and English: 

```json
    "webbookmarks.language": "es" | "en"
```

## Known Issues

---

## Release Notes
### 1.0.0
- Initial release of Web Bookmarks.

### 1.0.2
- Fixed Import and Export Functionality on Windows Platform.

### 1.1.1
#### Added
- Added the functionality of having folders in the bookmarks.
#### Changed
- There is a new JSON Structure for the bookmarks JSON file to match the new folder functionality.

### 1.2.0
#### Added
- Autorefresh of the webview when refocus.
- Only one panel open.
- Multilanguage Support, currently Spanish and English.
- Error Handling for better UX.
#### Changed
- The save location of bookmarks.json was changed to remain accesible after extension updates.

### 1.2.3
#### Fixed
- Reopen Bug

-----------------------------------------------------------------------------------------------------------