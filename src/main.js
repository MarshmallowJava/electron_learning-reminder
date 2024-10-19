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

let name = null;

ipcMain.on("send", (event, data) => {
  if(name !== null){
    data["name"] = name;
  }

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
        //IDを控えておく
        if("name" in body){
          name = body["name"];
          console.log("login as: " + name);
        }

        //返信
        mainWindow.webContents.send(data.action + "-result", body);
      }
    }
  );
});
