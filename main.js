const { app, BrowserWindow } =
require('electron');
const path = require('path');

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {

        }
    });
    win.loadFile('index.html');
}


app.whenReady().then(() => {
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





async function pickFolder(){
    let [fileHandle] = await window.showDirectoryPicker();
    console.log(fileHandle);
    
}

