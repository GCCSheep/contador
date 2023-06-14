const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('communication', {
    ping: () => ipcRenderer.invoke('ping')
});