function getListFilesandFoldersv0(){
  var folderId = Browser.inputBox('Enter folder ID', Browser.Buttons.OK_CANCEL);
  if (folderId === "") {
    Browser.msgBox('Folder ID is invalid');
    return;
  }
  makeListFilesAndFoldersv0(folderId, true); 
};


function makeListFilesAndFoldersv0(folderId, listAll) {
  const sh = SpreadsheetApp.getActiveSheet();
  const range = sh.getRange('A2:H')
  range.clear();
  sh.appendRow(["parent","folder", "name", "date created", "date updated", "owner", "URL", "ID"]);
  try {
    var parentFolder =DriveApp.getFolderById(folderId);
    listFilesv0(parentFolder,parentFolder.getName())
    listSubFoldersv0(parentFolder,parentFolder.getName());
  } catch (e) {
    Logger.log(e.toString());
  }
};

function listSubFoldersv0(parentFolder,parent) {
  var childFolders = parentFolder.getFolders();
  while (childFolders.hasNext()) {
    var childFolder = childFolders.next();
    Logger.log("Fold : " + childFolder.getName());
    listFilesv0(childFolder,parent)
    listSubFoldersv0(childFolder,parent + "|" + childFolder.getName());
  }
};

function listFilesv0(fold,parent){
  var sh = SpreadsheetApp.getActiveSheet();
  var data = [];
  var files = fold.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    data = [ 
      parent,
      fold.getName(),
      file.getName(),
      file.getDateCreated(),
      file.getLastUpdated(),
      file.getOwner().getEmail(),
      file.getUrl(),       
       file.getId(),
      //file.getSize(),
      //file.getDescription(),     
      //file.getMimeType()
      ];
    sh.appendRow(data);
  }
}