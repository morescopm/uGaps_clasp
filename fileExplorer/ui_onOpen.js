function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('List Files/Folders')
    .addItem('List Files V2', 'getListFilesandFolders')
    .addToUi();
}
