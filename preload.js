const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  getFiles: () => ipcRenderer.invoke('files:get'),
  setData: (playlist, file) => ipcRenderer.invoke('files:set', playlist, file)
});

