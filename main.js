// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu } = require('electron')
const path = require('path')

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

var electron = require('electron');

var width = 300;
var height = 400;
var taskbarHeight = 40;
var tray;


function openTimer() {
	timerWindow = new BrowserWindow({
		width: 150,
		height: 100,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false, 
			enableRemoteModule: true,
		},
		icon: __dirname + '/build/icon.ico',
		frame: false,
		resizable: false,
		alwaysOnTop: true,
		nodeIntegration: true,
		nodeIntegrationInWorker: true,
		nodeIntegrationInSubFrames: true,

	});
  
	timerWindow.loadFile('timer.htm');
}
/*
// Create the browser window.
function createWindow() {

	tray = new Tray('images/tray_icon1.png')
	const contextMenu = Menu.buildFromTemplate([

		{ label: 'Show dev tools', type:'checkbox', click: (menuItem, browserWindow, event)=>{
			mainWindow.toggleDevTools();
		}},
		{ label: 'Restart', click: (menuItem, browserWindow, event)=>{
			app.relaunch();
			app.exit();
		}},
		{ label: 'Open Timer', click: (menuItem, browserWindow, event)=>{
			openTimer();
		}},
		{ label: 'Exit', type: 'normal', role: 'quit' }
	]);
	tray.setToolTip('Taskedd');
	tray.setContextMenu(contextMenu);

	animateTrayIcon();

	var screen = electron.screen.getPrimaryDisplay().size;

	mainWindow = new BrowserWindow({
		title: 'Taskedd',
		width: width,
		height: height,
		minWidth: width,
		minHeight: height,
		maxWidth: width,
		maxHeight: screen.height - 100,
		movable: false,
		alwaysOnTop: true,
		icon: 'tray.ico',
		frame: false,
		skipTaskbar: true,
		x: screen.width - width,
		y: screen.height - height - taskbarHeight,
		webPreferences: {
			//preload: path.join(__dirname, 'tasks.js'),
			nodeIntegration: true
		}
	});

	// and load the index.html of the app.
	mainWindow.loadFile('tasks.htm')

	tray.on('click', e=>{
		
		
		if (mainWindow.isVisible())
			mainWindow.hide();
		else 
			mainWindow.show();
	});

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {


		mainWindow = null;

	});
}

*/




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', openTimer)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) openTimer()
})


app.requestSingleInstanceLock();

app.on('second-instance', (event, argv, cwd) => {
	app.quit();
});