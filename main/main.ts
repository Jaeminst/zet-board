// Main File for Electron
import { app, BrowserWindow, shell, ipcMain } from "electron";
import { autoUpdater } from 'electron-updater';
import path from 'path';
import serve from 'electron-serve';
import { registerIpcProfile } from "./profile";

const isDev = process.env.NODE_ENV === "development";
const port = 3000;

class AppUpdater {
  constructor() {
    autoUpdater.checkForUpdates();
    autoUpdater.on('update-downloaded', () => {
      if (process.platform === 'win32') {
        autoUpdater.quitAndInstall(true, true);
      } else {
        autoUpdater.quitAndInstall(false, false);
      }
    });
  }
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;
// let menuBuilder;

// run renderer
if (!isDev) {
  serve({ directory: "out" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

const createWindow = () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };
  win = new BrowserWindow({
    show: false,
    width: 1600,
    height: 900,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      devTools: isDev,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      /* eng-disable PRELOAD_JS_CHECK */
      disableBlinkFeatures: "Auxclick"
    },
  });

  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win?.setTitle(title);
  });

  // 메뉴바 제거
  win.setMenuBarVisibility(false);

  // Load app
  if (isDev) {
    win.loadURL(`http://localhost:${port}`);
  } else {
    win.loadURL("app://./home.html");
  }

  win.on('ready-to-show', () => {
    if (!win) {
      throw new Error('"win" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      win.minimize();
    } else {
      win.show();
    }
  });

  win.on('closed', () => {
    win = null;
  });

  // 메뉴바 제거
  // const menuBuilder = new MenuBuilder(win);
  // menuBuilder.buildMenu();

  // Open urls in the user's browser
  win.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();

  // 메인에서 렌더러로 메세지 보내기
  // win.webContents.on('did-finish-load', function () {
  //   // if (win !== null) win.webContents.send('test', 'test')
  // });
};
/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (win === null) createWindow();
    });
  })
  .catch(console.log);


// 시작시 프로파일 dev, qa, stage, prod 중 있는것 반환
registerIpcProfile();