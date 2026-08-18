const { app, BrowserWindow, ipcMain, dialog} = require('electron/main');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
let db;     //database




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
// calls addToFilesTable and adds file information to the filesTable
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

                //let fileName = path.parse(file).name;
                //let fileType = path.parse(file).ext;
                let fullPath = path.join(filePath, file);

                addToFilesTable(file, fullPath);
                console.log(file);
            })
            testPrintDatabase();
        }
    })

    // Possible Future Update: Recurse through folders within folders

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
function addToFilesTable(file, path){
    const insert = db.prepare('INSERT INTO filesTable (file, file_path) VALUES (?, ?)');

    insert.run(file, path);

}
// return the filesTable
// TO DO: only return files that are "unsorted" aka not in the playlist table
function getFilesTable(){
    const query = db.prepare('SELECT * FROM filesTable ORDER BY file');
    return query.all();
}

// returns the PlaylistsTable
function getPlaylistsTable(){
    const query = db.prepare(`
        SELECT
            playlistTitles.title AS playlist_name,
            playlists.file_name
        FROM playlistTitles
        LEFT JOIN playlists
            ON playlistTitles.title = playlists.playlist_name
        ORDER BY playlistTitles.title
        `);
    return query.all();
}

// prints all items in filesTable table for testing purposes
function testPrintDatabase(){
    const query = db.prepare('SELECT * FROM filesTable ORDER BY file');
    console.log(query.all());
}

// adds items to the filesTable for testing purposes
function testAddToDatabase(filename, path){
    const insert = db.prepare('INSERT OR IGNORE INTO filesTable (file, file_path) VALUES (?, ?)');

    insert.run('Clueless.mp4', 'Documents/Movies/RomCom');
    insert.run('Song.mp3', 'Documents/Music');

}

// creates the tables needed for file information and playlist information
function createDatabase(){

    db = new DatabaseSync('mediaLibrary.db');

    console.log("created database");
    db.exec(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS filesTable(
            file TEXT NOT NULL PRIMARY KEY,
            file_path TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS playlistTitles(
            title TEXT NOT NULL PRIMARY KEY,
            media_type TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS playlists(
            playlist_name TEXT NOT NULL,
            file_name TEXT NOT NULL,
            PRIMARY KEY(playlist_name, file_name),
            FOREIGN KEY(playlist_name) REFERENCES playlistTitles(title),
            FOREIGN KEY(file_name) REFERENCES filesTable(file)
        );
    `)

    //testAddToDatabase();
    //testPrintDatabase(); 
    //testAddToPlaylists();   
}

// adds items to the playlists
function addToPlaylists(event, playlist, file){
    const insert = db.prepare('INSERT INTO playlists (playlist_name, file_name) VALUES (?, ?)');
    insert.run(playlist, file);
}

// creates a new empty playlist
function createPlaylist(event, playlist, type){
    const insert = db.prepare('INSERT INTO playlistTitles (title, media_type) VALUES (?, ?)');
    insert.run(playlist, type);    
}


// adds item to playlist for testing purposes only
function testAddToPlaylists(){
    const insert = db.prepare('INSERT OR IGNORE INTO playlists (playlist_name, file_name) VALUES (?, ?)');
    insert.run("Movies", "Clueless.mp4");
    insert.run("Music", "Song.mp3");
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
    ipcMain.handle('playlists:get', () => {
        return getPlaylistsTable();
    });
    ipcMain.handle('files:set', addToPlaylists)
    ipcMain.handle('playlists:create', createPlaylist)
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




