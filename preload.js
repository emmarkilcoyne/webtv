const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  getFiles: () => ipcRenderer.invoke('files:get'),
  getPlaylists: () => ipcRenderer.invoke('playlists:get'),
  createPlaylist: (playlist, type) => ipcRenderer.invoke('playlists:create', playlist, type),
  setData: (playlist, file) => ipcRenderer.invoke('files:set', playlist, file)

});

