const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Window management
  createNewWindow: (isIncognito) => ipcRenderer.invoke('create-new-window', isIncognito),
  closeWindow: (windowId) => ipcRenderer.invoke('close-window', windowId),
  
  // Navigation
  navigateWebview: (webviewId, url) => ipcRenderer.invoke('navigate-webview', webviewId, url),
  webviewBack: (webviewId) => ipcRenderer.invoke('webview-back', webviewId),
  webviewForward: (webviewId) => ipcRenderer.invoke('webview-forward', webviewId),
  webviewReload: (webviewId) => ipcRenderer.invoke('webview-reload', webviewId),
  
  // Bookmarks
  addBookmark: (bookmark) => ipcRenderer.invoke('add-bookmark', bookmark),
  getBookmarks: () => ipcRenderer.invoke('get-bookmarks'),
  
  // Dialogs
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  
  // Event listeners
  onNavigateWebview: (callback) => {
    ipcRenderer.on('navigate-webview', (event, data) => callback(data));
  },
  onWebviewBack: (callback) => {
    ipcRenderer.on('webview-back', (event, data) => callback(data));
  },
  onWebviewForward: (callback) => {
    ipcRenderer.on('webview-forward', (event, data) => callback(data));
  },
  onWebviewReload: (callback) => {
    ipcRenderer.on('webview-reload', (event, data) => callback(data));
  },
  
  // Platform info
  platform: process.platform,
  versions: process.versions,
});

// Test communication
contextBridge.exposeInMainWorld('testAPI', {
  send: (message) => ipcRenderer.send('test-message', message),
  onResponse: (callback) => ipcRenderer.on('main-response', (event, arg) => callback(arg)),
});
