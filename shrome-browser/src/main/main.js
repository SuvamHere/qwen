const { app, BrowserWindow, ipcMain, session, dialog } = require('electron');
const path = require('path');

// Disable hardware acceleration if needed
// app.disableHardwareAcceleration();

let mainWindow;
let windows = new Map(); // Track all windows

function createWindow(isIncognito = false) {
  const windowOptions = {
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: true,
    backgroundColor: isIncognito ? '#1a1a2e' : '#ffffff',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      sandbox: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, '../../assets/icons/icon.png'),
    show: false,
  };

  const win = new BrowserWindow(windowOptions);
  
  // Set incognito session
  if (isIncognito) {
    win.webContents.session = session.fromPartition('persist:incognito-' + Date.now());
  }

  // Load the React app
  if (process.env.NODE_ENV === 'development' || process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  // Store window reference
  const windowId = win.id;
  windows.set(windowId, { win, isIncognito });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.on('closed', () => {
    windows.delete(windowId);
    if (windows.size === 0) {
      // Save session before quitting if last window
      saveSession();
    }
  });

  return win;
}

// Session management
function saveSession() {
  const sessionData = {
    windows: Array.from(windows.entries()).map(([id, data]) => ({
      isIncognito: data.isIncognito,
    })),
    timestamp: Date.now(),
  };
  
  ipcMain.emit('save-session-data', sessionData);
}

function restoreSession() {
  // Will be implemented with Redux state persistence
  return [];
}

// IPC Handlers
ipcMain.handle('create-new-window', (event, isIncognito = false) => {
  const newWin = createWindow(isIncognito);
  return newWin.id;
});

ipcMain.handle('close-window', (event, windowId) => {
  const win = BrowserWindow.fromId(windowId);
  if (win) {
    win.close();
  }
});

ipcMain.handle('navigate-webview', (event, webviewId, url) => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.webContents.send('navigate-webview', { webviewId, url });
  }
});

ipcMain.handle('webview-back', (event, webviewId) => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.webContents.send('webview-back', { webviewId });
  }
});

ipcMain.handle('webview-forward', (event, webviewId) => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.webContents.send('webview-forward', { webviewId });
  }
});

ipcMain.handle('webview-reload', (event, webviewId) => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.webContents.send('webview-reload', { webviewId });
  }
});

ipcMain.handle('add-bookmark', async (event, bookmark) => {
  // Will be handled by renderer process with lowdb
  return bookmark;
});

ipcMain.handle('get-bookmarks', async () => {
  // Will be handled by renderer process with lowdb
  return [];
});

ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-open-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

// Security: Block certain permissions
app.on('web-contents-created', (event, contents) => {
  contents.on('will-attach-webview', (event, webPreferences, params) => {
    // Strip away preloads if not needed
    delete webPreferences.preload;
    // Disable plugins
    webPreferences.plugins = false;
  });

  contents.on('permission-request', (event, permission, callback) => {
    // Deny all permissions by default, allow selectively
    const allowedPermissions = ['clipboard-sanitized-write'];
    if (allowedPermissions.includes(permission)) {
      callback(true);
    } else {
      callback(false);
    }
  });
});

app.whenReady().then(() => {
  mainWindow = createWindow();
  
  // Test receiving messages from renderer
  ipcMain.on('test-message', (event, arg) => {
    console.log('Main process received:', arg);
    event.reply('main-response', 'Hello from main process!');
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createWindow();
  }
});

// Handle second instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Export for testing
module.exports = { createWindow };
