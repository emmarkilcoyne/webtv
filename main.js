const { app, BrowserWindow, ipcMain, dialog} = require('electron/main');
const path = require('path');

async function handleFileOpen(){

    //let [fileHandle] = await window.showDirectoryPicker();
    //console.log(fileHandle);

    console.log("pick folder function called")
    const result =  await dialog.showOpenDialog({ properties: ['openDirectory'] });
    return result;
    
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




