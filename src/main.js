const { app, BrowserWindow, ipcMain } = require('electron');
const request = require('request');

const url = "https://script.google.com/macros/s/AKfycbx5VCqBVgEO9pOsMHq5RS9iSRyT7qS2TtHYxKiFDqGn1XiLVQgRWdQDzDVk904I7Zte0g/exec";
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.setMenuBarVisibility(false)

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
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

ipcMain.on("send", (event, data) => {
  console.log("send: ", data);

  request.post(
    {
      url: url,
      json: true,
      body: data,
      followAllRedirects: true
    },
    (error, response, body) => {
      if(error){
        console.log("error has occured");
      }else{
        mainWindow.webContents.send(data.action + "-result", body);
      }
    }
  );
});
