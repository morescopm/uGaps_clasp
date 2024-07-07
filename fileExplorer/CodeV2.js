function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('List Files/Folders')
    .addItem('List All Files and Folders', 'getListFilesandFolders')
    .addItem('List Files V2', 'getListFilesandFoldersV2')
    .addToUi();
}

function getListFilesandFoldersV2() {
  var folderId = Browser.inputBox('Enter folder ID', Browser.Buttons.OK_CANCEL);
  if (folderId === "" || folderId === "cancel") {
    Browser.msgBox('Folder ID is invalid or operation was canceled.');
    return;
  }
  const sh = SpreadsheetApp.getActiveSheet();
  const range = sh.getRange('A2:J');
  range.clear();
  sh.appendRow([
    "parent", 
    "folder", 
    "name", 
    "date created", 
    "date updated", 
    "URL", 
    "ID", 
    "size (MB)", 
    "mime type"
    ]);
  try {
    var parentFolder = DriveApp.getFolderById(folderId);
    listFilesAndFoldersV2(parentFolder, parentFolder.getName());
  } catch (e) {
    Logger.log('Error: ' + e.toString());
    Browser.msgBox('Error: ' + e.toString());
  }
}

function listFilesAndFoldersV2(parentFolder, parent) {
  var data = [];
  listFilesV2(parentFolder, parent, data);
  listSubFoldersV2(parentFolder, parent, data);
  flushData(data);
}

function listSubFoldersV2(parentFolder, parent, data) {
  var childFolders = parentFolder.getFolders();
  while (childFolders.hasNext()) {
    var childFolder = childFolders.next();
    Logger.log("Folder: " + childFolder.getName());
    listFilesV2(childFolder, parent, data);
    listSubFoldersV2(childFolder, parent + "|" + childFolder.getName(), data);
  }
}

function listFilesV2(fold, parent, data) {
  var files = fold.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    try {
      var sizeMB = (file.getSize() / (1024 * 1024)).toFixed(2); // Convert size to MB and format to 2 decimal places
      var rowData = [
        parent,
        fold.getName(),
        file.getName(),
        file.getDateCreated(),
        file.getLastUpdated(),
        file.getUrl(),
        file.getId(),
        sizeMB,
        file.getMimeType()
      ];
      data.push(rowData);

      if (data.length >= 100) { // Adjust this threshold as needed
        flushData(data);
      }
    } catch (e) {
      Logger.log('Error fetching file details: ' + e.toString());
    }
  }
}

function flushData(data) {
  if (data.length > 0) {
    var sh = SpreadsheetApp.getActiveSheet();
    sh.getRange(sh.getLastRow() + 1, 1, data.length, data[0].length).setValues(data);
    data.length = 0; // Clear the array
  }
}
