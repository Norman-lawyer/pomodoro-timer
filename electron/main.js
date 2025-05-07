import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';

// 添加全局错误处理
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

let mainWindow = null;

function createWindow() {
  try {
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: true,
        devTools: true
      },
      frame: true,
      titleBarStyle: 'default',
      resizable: true,
      minWidth: 1000,
      minHeight: 600,
      center: true,
      show: false,
      backgroundColor: '#ffffff'
    });

    // 添加错误处理
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Failed to load:', errorCode, errorDescription);
    });

    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
      console.log('Renderer Console:', message);
    });

    mainWindow.webContents.on('crashed', () => {
      console.error('Renderer process crashed');
    });

    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            `default-src 'self';
             script-src 'self' 'unsafe-inline' 'unsafe-eval';
             style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
             font-src 'self' https://fonts.gstatic.com;
             img-src 'self' data: https:;
             connect-src 'self' ws://localhost:*;
             media-src 'self' blob:;`
          ]
        }
      });
    });

    mainWindow.once('ready-to-show', () => {
      if (mainWindow) {
        mainWindow.show();
        if (isDev) {
          mainWindow.webContents.openDevTools();
        }
      }
    });

    if (isDev) {
      mainWindow.loadURL('http://localhost:5173');
    } else {
      const indexPath = path.join(__dirname, '../dist/index.html');
      console.log('Loading index.html from:', indexPath);
      
      if (fs.existsSync(indexPath)) {
        console.log('index.html exists');
        mainWindow.loadFile(indexPath).catch(err => {
          console.error('Failed to load index.html:', err);
          console.log('Attempted path:', indexPath);
        });
      } else {
        console.error('index.html does not exist at:', indexPath);
        // 尝试列出目录内容
        const distDir = path.join(__dirname, '../dist');
        if (fs.existsSync(distDir)) {
          console.log('Contents of dist directory:', fs.readdirSync(distDir));
        } else {
          console.error('dist directory does not exist');
        }
      }
    }
  } catch (error) {
    console.error('Error creating window:', error);
  }
}

app.whenReady().then(() => {
  console.log('App is ready');
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

app.on('before-quit', () => {
  if (mainWindow) {
    mainWindow.removeAllListeners('close');
    mainWindow.close();
  }
});