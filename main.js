const { app, BrowserWindow, ipcMain, dialog} = require('electron/main');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');




//select media folder button
async function handleFileOpen(){

    console.log("pick folder function called")
    const result =  await dialog.showOpenDialog({ properties: ['openDirectory'] });


    // user hit cancel
    if (result.canceled){
        dialog.showErrorBox("Error", "File path not found.");
    }
    
    else {
        scrapeFolderData(result.filePaths[0]);
    }
    return result;
    
}

// functions scrapes file information from the selected directory
// calls addTODatabase and adds file information to the filesTable
// current status pulls strings only from selected folder 

function scrapeFolderData(filePath){

    console.log(filePath);

    fs.readdir(filePath, (err, files) => {
        if (err){
            console.log(err);
        }
        else {
            console.log("Current directory filenames:");
            files.forEach(file => {

                let fileName = path.parse(file).name;
                let fileType = path.parse(file).ext;
                let fullPath = path.join(filePath, file);

                addToFilesTable(fileName, fileType, fullPath);
                console.log(file);
            })
            testPrintDatabase();
        }
    })

    // Future Update: Recurse through folders within folders

    /*
    fs.readdir(filepath, { withFileTypes: true }, (err, files) => {
        if (err){
            console.log(err);
        }
        else {
            console.log("Current directory filenames:");
            files.forEach(file => {
                if(file.isDirectory()){
                    console.log("Folder: ", file);
                    scrapeFolderData(path.join(filepath, file.name));
                }
                console.log("File: ", file);
            })
        }
    })
    */
    
}

// adds items to the filesTable
function addToFilesTable(fileName, fileType, path){
    const insert = db.prepare('INSERT INTO filesTable (file_name, file_type, file_path) VALUES (?, ?, ?)');

    insert.run(fileName, fileType, path);

}

function getFilesTable(){
    const query = db.prepare('SELECT * FROM filesTable ORDER BY file_name');
    return query.all();
}

// prints all items in filesTable table for testing purposes
function testPrintDatabase(){
    const query = db.prepare('SELECT * FROM filesTable ORDER BY file_name');

    console.log(query.all());
}

// adds items to the filesTable for testing purposes
function testAddToDatabase(filename, path){
    const insert = db.prepare('INSERT INTO filesTable (file_name, file_type, file_path) VALUES (?, ?, ?)');

    insert.run('spiderman', 'mp4', 'Documents/Movies/Action');

}

// creates the filesTable table for metadata on files in selected directory
let db;
function createDatabase(){

    db = new DatabaseSync(':memory:');

    console.log("created database");
    db.exec(`
        CREATE TABLE IF NOT EXISTS filesTable(
            file_name TEXT NOT NULL,
            file_type TEXT NOT NULL,
            file_path TEXT NOT NULL,
            PRIMARY KEY (file_name, file_type))
    `)

    //testAddToDatabase();
    //testPrintDatabase();    
}

// electron processes
function createWindow () {
    const win = new BrowserWindow({
        width: 1100,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.loadFile('index.html');
}


app.whenReady().then(() => {
    createDatabase();
    
    ipcMain.handle('dialog:openFile', handleFileOpen)
    ipcMain.handle('files:get', () => {
        return getFilesTable();
    });
    createWindow();
    
    
    
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0){
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});




