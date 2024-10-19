
const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('updateData', {
    send: (data) => ipcRenderer.send('send', data),
    response: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
});
