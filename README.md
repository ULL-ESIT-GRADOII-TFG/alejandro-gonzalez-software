# Web Bookmarks Extension
[![Build Status](https://travis-ci.com/ULL-ESIT-GRADOII-TFG/alejandro-gonzalez-software.svg?token=PnidsgQLm74nYpn9BCGD&branch=master)](https://www.travis-ci.com/ULL-ESIT-GRADOII-TFG/alejandro-gonzalez-software)

Web Bookmarks allows you to keep your favourites websites inside the VSCODE environment. 

## Features

To execute the extension just open the vscode command palette and type <code>Open Web Bookmarks</code> and click to run. Alternatively you can run it pressing the shortcut available:

* Linux & Windows: <code>ctrl + shift + l</code>
* MacOS: <code>cmd + shift + l</code>

The bookmarks JSON has to match the next structure for the extension to work fully:

```javascript
    { //Root Object (the order of bookmarks/folder doesn't matter)
        "bookmark name":"url", //if it is a bookmark
        "folder name": { //if it is a folder
            ... //repeat structure
        }
    }
```

## Requirements

This extension is require vscode version ^1.31.0.

## Extension Settings

This extension does not have any settings for now

## Known Issues

---

## Release Notes
### 1.0.0

Initial release of Web Bookmarks.

### 1.0.2
Fixed Import and Export Functionality on Windows Platform.

### 1.1.1
#### Added
Added the functionality of having folders in the bookmarks.
#### Changed
There is a new JSON Structure for the bookmarks JSON file to match the new forlder functionality.
-----------------------------------------------------------------------------------------------------------