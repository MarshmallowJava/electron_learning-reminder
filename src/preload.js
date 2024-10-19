
const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('updateData', {
    request: () => ipcRenderer.send('update-data'),
    append: (data) => ipcRenderer.send('append-data', data),
    resolve: (data) => ipcRenderer.send('resolve-data', data),
    response: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
});
