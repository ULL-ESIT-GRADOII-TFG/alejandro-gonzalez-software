//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

import * as vscode from 'vscode'
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
describe("Extension Tests", function () {

    // Defines a Mocha unit test
    it("Extention starts without crashing", async function () {
        vscode.commands.executeCommand('extension.openWebBookmarks');
    });
});