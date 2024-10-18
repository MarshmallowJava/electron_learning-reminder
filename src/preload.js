
const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('updateData', {
    request: () => ipcRenderer.send('update-data'),
    response: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
});
