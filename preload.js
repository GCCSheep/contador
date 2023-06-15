const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    patients: () => ipcRenderer.invoke('patients'),
    setTitle: (title) => ipcRenderer.send('set-title', title),
});