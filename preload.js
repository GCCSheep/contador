const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setPatients: (patients) => ipcRenderer.send('set-patients', patients),
    onGetPatients: (callback) => ipcRenderer.on('get-patients', callback),
});