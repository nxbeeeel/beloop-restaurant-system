const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/icon.png'),
    show: false,
    titleBarStyle: 'default'
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:3002');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Maximize window for POS
    mainWindow.maximize();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Order',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('new-order');
          }
        },
        {
          label: 'Print Receipt',
          accelerator: 'CmdOrCtrl+P',
          click: () => {
            mainWindow.webContents.print();
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'POS',
      submenu: [
        {
          label: 'Switch to Dine-in',
          click: () => {
            mainWindow.webContents.send('switch-order-type', 'dine-in');
          }
        },
        {
          label: 'Switch to Takeaway',
          click: () => {
            mainWindow.webContents.send('switch-order-type', 'takeaway');
          }
        },
        {
          label: 'Switch to Delivery',
          click: () => {
            mainWindow.webContents.send('switch-order-type', 'delivery');
          }
        },
        { type: 'separator' },
        {
          label: 'Cash Drawer',
          accelerator: 'F1',
          click: () => {
            mainWindow.webContents.send('open-cash-drawer');
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Beloop POS',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Beloop POS',
              message: 'Beloop POS System',
              detail: 'Version 1.0.0\nPremium Restaurant Management System\nBuilt for Indian F&B Market'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createMenu();

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

// IPC handlers for hardware integration
ipcMain.handle('print-receipt', async (event, receiptData) => {
  try {
    // Here you can integrate with thermal printer
    console.log('Printing receipt:', receiptData);
    return { success: true };
  } catch (error) {
    console.error('Print error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('open-cash-drawer', async () => {
  try {
    // Here you can integrate with cash drawer hardware
    console.log('Opening cash drawer');
    return { success: true };
  } catch (error) {
    console.error('Cash drawer error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-system-info', async () => {
  return {
    platform: process.platform,
    version: app.getVersion(),
    name: app.getName()
  };
});
