const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback),
});