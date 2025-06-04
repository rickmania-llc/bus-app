const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel, ...args) => {
    const validChannels = [
      'get-students',
      'add-student',
      'update-student',
      'delete-student',
      'get-routes',
      'add-route',
      'update-route',
      'delete-route',
      'get-drivers',
      'add-driver',
      'update-driver',
      'delete-driver',
      'get-guardians',
      'add-guardian',
      'update-guardian',
      'delete-guardian'
    ];
    
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    }
    throw new Error(`Invalid channel: ${channel}`);
  },
  
  send: (channel, ...args) => {
    const validChannels = ['log', 'error'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, ...args);
    }
  },
  
  on: (channel, callback) => {
    const validChannels = [
      'students-updated',
      'routes-updated',
      'drivers-updated',
      'guardians-updated'
    ];
    
    if (validChannels.includes(channel)) {
      const subscription = (event, ...args) => callback(...args);
      ipcRenderer.on(channel, subscription);
      
      return () => ipcRenderer.removeListener(channel, subscription);
    }
    throw new Error(`Invalid channel: ${channel}`);
  }
});