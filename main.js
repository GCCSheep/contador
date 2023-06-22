const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');
const store = new Store();

app.whenReady().then(() => {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
    ipcMain.on('set-patients', handleSetPatients);
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
    const menu = Menu.buildFromTemplate([]);
    Menu.setApplicationMenu(menu);
    mainWindow.loadFile('index.html').then(() => {
        let patients = store.get('patients');
        if (!patients) {
            patients = [];
        }
        mainWindow.webContents.send('get-patients', JSON.parse(patients));
    });
}

function handleSetPatients(event, patients) {
    store.set('patients', patients);
}