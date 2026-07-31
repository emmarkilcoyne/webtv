const { app, BrowserWindow, ipcMain, dialog} = require('electron/main');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');




//select media folder button
async function handleFileOpen(){

    console.log("pick folder function called")
    const result =  await dialog.showOpenDialog({ properties: ['openDirectory'] });


    // user hit cancel
    if (result.canceled){
        dialog.showErrorBox("Error", "File path not found.");
    }
    
    else {
        scrapeFileData(result.filePaths[0]);
    }
    return result;
    
}

function scrapeFileData(filepath){


    console.log(filepath);
}


function testPrintDatabase(db){
    const query = db.prepare('SELECT * FROM filesTable ORDER BY file_name');

    console.log(query.all());
}

function testAddToDatabase(db){
    const insert = db.prepare('INSERT INTO filesTable (file_name, file_type, file_path) VALUES (?, ?, ?)');

    insert.run('spiderman', 'mp4', 'Documents/Movies/Action');

}

function createDatabase(){

    const db = new DatabaseSync(':memory:');

    console.log("created database");
    db.exec(`
        CREATE TABLE IF NOT EXISTS filesTable(
            file_name TEXT NOT NULL,
            file_type TEXT NOT NULL,
            file_path TEXT NOT NULL,
            PRIMARY KEY (file_name, file_type))
    `)

    testAddToDatabase(db);
    testPrintDatabase(db);

    
}


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
    ipcMain.handle('dialog:openFile', handleFileOpen)
    createWindow();
    createDatabase();
    
    
    
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




