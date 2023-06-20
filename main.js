const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

app.whenReady().then(() => {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
    ipcMain.on('set-title', handleSetTitle);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

function createWindow() {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    });
    mainWindow.loadFile('index.html').then(() => {
        const filePath = path.join(__dirname, 'patients.json'); 
        mainWindow.webContents.send('get-patients', JSON.parse(fs.readFileSync(filePath)));
    });
}

async function handleSetTitle(event, title) {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
}