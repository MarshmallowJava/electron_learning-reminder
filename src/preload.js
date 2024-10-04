
const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('subPageAPI', {
    open: () => ipcRenderer.send('open-sub-page')
});
