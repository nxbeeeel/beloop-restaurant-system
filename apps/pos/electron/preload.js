const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Hardware integration
  printReceipt: (receiptData) => ipcRenderer.invoke('print-receipt', receiptData),
  openCashDrawer: () => ipcRenderer.invoke('open-cash-drawer'),
  
  // System info
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  
  // Menu events
  onNewOrder: (callback) => ipcRenderer.on('new-order', callback),
  onSwitchOrderType: (callback) => ipcRenderer.on('switch-order-type', callback),
  onOpenCashDrawer: (callback) => ipcRenderer.on('open-cash-drawer', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Platform detection
  isElectron: true,
  platform: process.platform
});
