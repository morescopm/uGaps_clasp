# Readme
 What this does: When embedded in a google sheets container, this will:
 1. Add a menu to the sheet
 2. Allow for folder ID to be passed in a dialog
 3. Scroll through files and folder children and return a list of all objects

# Deploy the standalone as a library
 1. Create a version
 2. Deploy the version as a library
 3. Make note of the library id

# Installation into a Container
 1. Create a new google sheet in browser
    > sheet.new  
    > sheets.google.com/create
 2. Add a container script to the project
 3. Select the library



# Functions in LIbrary
function getListFilesandFolders() {}
function listFilesAndFolders(parentFolder, parent) {}
function listSubFolders(parentFolder, parent, data) {}
function listFiles(fold, parent, data) {}
function flushData(data) {}