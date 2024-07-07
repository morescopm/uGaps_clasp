function getListFilesandFoldersV2() {
  var folderId = Browser.inputBox('Enter folder ID', Browser.Buttons.OK_CANCEL);
  if (folderId === "" || folderId === "cancel") {
    Browser.msgBox('Folder ID is invalid or operation was canceled.');
    return;
  }
  const sh = SpreadsheetApp.getActiveSheet();
  if (sh.getRange('A2:2').isBlank()) {
    const range = sh.getRange('A2:T');
    range.clear();
    sh.appendRow([
      'observationID',
      'deploymentID',
      'mediaID',
      'URL',
      "thumbnail", // Special addition for ease of observation
      'observationType',
      'count',
      'commonName',
      'scientificName',
      'lifeStage',
      'sex',
      'classifiedBy',
      'classificationTimestamp',
      'observationComments',
      'observationLevel',
      'classificationMethod',
      'dateUpdated', 
      'ID',
      'sizeMB',
      'mimeType'
      // 'eventID',
      // 'eventStart',
      // 'eventEnd',
      // 'cameraSetupType',
      // 'behavior',
      // 'individualID',
      // 'individualPositionRadius',
      // 'individualPositionAngle',
      // 'individualSpeed',
      // 'bboxX',
      // 'bboxY',
      // 'bboxWidth',
      // 'bboxHeight',
      // 'classificationProbability',
      // 'observationTags',
      ]);
  }
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
    listSubFoldersV2(childFolder, parent + "/" + childFolder.getName(), data);
  }
}

function listFilesV2(fold, parent, data) {
  var files = fold.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    try {
      var sizeMB = (file.getSize() / (1024 * 1024)).toFixed(2); // Convert size to MB and format to 2 decimal places
      var mime = file.getMimeType();
      if (mime.startsWith('image/') || mime.startsWith('video/')) {
        var rowData = [
          Utilities.getUuid(), // observation id colA
          parent + "/" + fold.getName(), // deployment id colB
          file.getName(), // media id colC
          file.getUrl(), // url colD
          '=IMAGE("https://drive.google.com/uc?id='+ file.getId() + '&export=view",1)', // thumbnail colE
          "", // observation type drop down validation colF
          "", // count colG
          "", // common name drop down validation colH
          "=XLOOKUP(commonName,speciesNames!$A$2:$A,speciesNames!$B$2:$B,)", // scientific name lookup formula colI
          "", // lifestage drop down validation colJ
          "", // sex drop down validation colK
          "", // classified by colL
          "", // classification Timestamp colM
          "", // observation comments colN
          "media", // observation level colO
          "human", // classification method colP
          file.getLastUpdated(), // date updated colQ
          file.getId(), // id colR
          sizeMB,  // file size colS
          file.getMimeType() // mime type colT
        ];
        data.push(rowData);

        if (data.length >= 500) { // Adjust this threshold as needed
          flushData(data);
        }
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
