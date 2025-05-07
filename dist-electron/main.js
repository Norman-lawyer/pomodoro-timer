import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === "development";
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true,
      devTools: isDev
    },
    frame: true,
    titleBarStyle: "default",
    resizable: true,
    minWidth: 1e3,
    minHeight: 600,
    center: true,
    show: false,
    backgroundColor: "#ffffff"
  });
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          `default-src 'self';
           script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""};
           style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
           font-src 'self' https://fonts.gstatic.com;
           img-src 'self' data: https:;
           connect-src 'self' ${isDev ? "ws://localhost:*" : ""};
           media-src 'self' blob:;`
        ]
      }
    });
  });
  win.once("ready-to-show", () => {
    win.show();
    if (isDev) {
      win.webContents.openDevTools();
    }
  });
  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
