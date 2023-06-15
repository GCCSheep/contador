const path = require('path');
const fs = require('fs');
const { app, BrowserWindow, ipcMain } = require('electron');

function createWindow() {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    });
    mainWindow.loadFile('index.html');
}

function handleSetTitle(event, title) {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
}

app.whenReady().then(() => {
    ipcMain.handle('patients', () => JSON.parse(fs.readFileSync(path.join(__dirname, 'patients.json'))));
    ipcMain.on('set-title', handleSetTitle);
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});