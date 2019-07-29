const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const manualDebug = true
const windowStateKeeper = require('electron-window-state')

/*************************************************************
 * py process
 *************************************************************/

const PY_DIST_FOLDER = 'pycalcdist'
const PY_FOLDER = 'pycalc'
const PY_MODULE = 'api' // without .py suffix

let pyProc = null
let pyPort = null

const guessPackaged = () => {
  const fullPath = path.join(__dirname, PY_DIST_FOLDER)
  return require('fs').existsSync(fullPath)
}

const getScriptPath = () => {
  if (!guessPackaged()) {
    return path.join(__dirname, PY_FOLDER, PY_MODULE + '.py')
  }
  if (process.platform === 'win32') {
    return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + '.exe')
  }
  return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE)
}

const selectPort = () => {
  pyPort = 4242
  return pyPort
}

const createPyProc = () => {
  let script = getScriptPath()
  let port = '' + selectPort()
  if (!manualDebug) {
    if (guessPackaged()) {
      pyProc = require('child_process').execFile(script, [port])
    } else {
      pyProc = require('child_process').spawn('python', [script, port])
    }

    if (pyProc != null) {
      //console.log(pyProc)
      console.log('child process success on port ' + port)
    }
  }
}

const exitPyProc = () => {
  if (!manualDebug) {
    pyProc.kill();
    pyProc = null;
    pyPort = null;
  }
}

process.on('SIGINT', function () {
  console.log("Caught interrupt signal");

  if (i_should_exit)
    process.exit();
});

app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)
app.on('quit', exitPyProc)

/*************************************************************
 * window management
 *************************************************************/

let mainWindow = null;
let secondaryWindow = null;



function createWindow() {

  let winState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  })


  mainWindow = new BrowserWindow({
    minWidth: 500,
    width: winState.width,
    x: winState.x,
    minHeight: 400,
    height: winState.height,
    y: winState.y,

    webPreferences: {
      nodeIntegration: true
    },
  })



  let wc = mainWindow.webContents;
  console.log(wc);
  // Load the index.html
  mainWindow.loadFile('index.html')
 

  winState.manage(mainWindow)

  //Load devtools
  mainWindow.webContents.openDevTools()

  //Close the windows
  mainWindow.on('closed', () => {
    mainWindow = null
  })

}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})