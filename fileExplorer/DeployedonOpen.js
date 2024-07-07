function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('List Files/Folders')
    .addItem('Add media by Folder ID', 'getListFilesandFoldersV2')
    .addToUi();
}