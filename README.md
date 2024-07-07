# uGaps_clasp
 Useful Google Apps Script - Command Line Dev

# Reference
 Go to: https://codelabs.developers.google.com/codelabs/clasp/#0 for more depth on Google Clasp (The Apps Script CLI)

# Installation
 1. Install Node.js https://nodejs.org/en/download/
 2. When node is installed, install cli globally
    > npm i @google/clasp -g
 3. Login using google oauth by following online prompts. This will associate your google account to any projects created.
    > clasp login
 4. Create or clone a project
    - Example of creation
    > mkdir clasp_codelab
    > cd clasp_codelab
    > clasp create --title "Clasp Codelab" --type standalone
    - Example of Clone container-bound
    > mkdir <scriptNameDirectory> (by choice)
    > cd <scriptNameDirectory> (by choice)
    > clasp clone <scriptID> (from existing AppsScript)
5. Pulling & Pushing Files
    ### You will need to turn on the Apps Script API
    - https://script.google.com/home/usersettings
    - when inside the file directory where cloned, to download changes made online
    > clasp pull
    - when inside the file directory where cloned, to send local changes to online
    > clasp push
6. Versioning
    - Verion: snapshot of script, read only
    - Deployment: published release requiring a version
    - To see versions:
        > clasp versions
    - To create new version:
        > clasp version "<versionName>"
    - To deploy a specific version
        > clasp deploy <versionNumber: int> "<deploymentName>"