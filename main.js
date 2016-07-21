const electron = require('electron');

const app = electron.app;

const BrowserWindow = electron.BrowserWindow;


let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 600, height: 210, icon: __dirname + '/app/assets/icon_1.ico'});

  mainWindow.loadURL(`file://${__dirname}/app/index.html`);

  mainWindow.setMenu(null);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  };
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  };
});