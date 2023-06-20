const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    onGetPatients: (callback) => ipcRenderer.on('get-patients', callback),
});