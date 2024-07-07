// Appends to active sheet in row 2 of A:J, then appends details
function getListFilesandFolders() {
  var folderId = Browser.inputBox('Enter folder ID', Browser.Buttons.OK_CANCEL);
  // Error handling for invalid folder id
  if (folderId === "" || folderId === "cancel") {
    Browser.msgBox('Folder ID is invalid or operation was canceled.');
    return;
  }
  // IF folder ID is valid
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
    listFilesAndFolders(parentFolder, parentFolder.getName());
  } catch (e) {
    Logger.log('Error: ' + e.toString());
    Browser.msgBox('Error: ' + e.toString());
  }
}

function listFilesAndFolders(parentFolder, parent) {
  var data = [];
  listFiles(parentFolder, parent, data);
  listSubFolders(parentFolder, parent, data);
  flushData(data);
}

function listSubFolders(parentFolder, parent, data) {
  var childFolders = parentFolder.getFolders();
  while (childFolders.hasNext()) {
    var childFolder = childFolders.next();
    Logger.log("Folder: " + childFolder.getName());
    listFiles(childFolder, parent, data);
    listSubFolders(childFolder, parent + "|" + childFolder.getName(), data);
  }
}

function listFiles(fold, parent, data) {
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
