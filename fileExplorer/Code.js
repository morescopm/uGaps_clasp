function onOpen() {
  var SS = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('List Files/Folders')
    .addItem('List All Files and Folders', 'getListFilesandFolders')
    .addToUi();
}

function getListFilesandFolders(){
  var folderId = Browser.inputBox('Enter folder ID', Browser.Buttons.OK_CANCEL);
  if (folderId === "" || folderId === "cancel") {
    Browser.msgBox('Folder ID is invalid or operation was canceled.');
    return;
  }
  makeListFilesAndFolders(folderId, true); 
}

function makeListFilesAndFolders(folderId, listAll) {
  const sh = SpreadsheetApp.getActiveSheet();
  const range = sh.getRange('A2:H');
  range.clear();
  sh.appendRow(["parent", "folder", "name", "date created", "date updated", "URL", "ID", "size (MB)", "description", "mime type"]);
  try {
    var parentFolder = DriveApp.getFolderById(folderId);
    listFiles(parentFolder, parentFolder.getName());
    listSubFolders(parentFolder, parentFolder.getName());
  } catch (e) {
    Logger.log('Error: ' + e.toString());
    Browser.msgBox('Error: ' + e.toString());
  }
}

function listSubFolders(parentFolder, parent) {
  var childFolders = parentFolder.getFolders();
  while (childFolders.hasNext()) {
    var childFolder = childFolders.next();
    Logger.log("Folder: " + childFolder.getName());
    listFiles(childFolder, parent);
    listSubFolders(childFolder, parent + "|" + childFolder.getName());
  }
}

function listFiles(fold, parent) {
  var sh = SpreadsheetApp.getActiveSheet();
  var files = fold.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    try {
      var sizeMB = (file.getSize() / (1024 * 1024)).toFixed(2); // Convert size to MB and format to 2 decimal places
      var data = [ 
        parent,
        fold.getName(),
        file.getName(),
        file.getDateCreated(),
        file.getLastUpdated(),
        file.getUrl(),
        file.getId(),
        sizeMB,
        file.getDescription(),
        file.getMimeType()
      ];
      sh.appendRow(data);
    } catch (e) {
      Logger.log('Error fetching file details: ' + e.toString());
    }
  }
}
