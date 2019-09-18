const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let win;
let addWindow;

// Listen for app to be ready
app.on('ready', function () {

    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    win.loadFile('index.html');

    // Quit app when closed
    win.on('closed', function () {
       app.quit();
    });

    // Open the DevTools.
    // win.webContents.openDevTools();

    const menu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(menu);
});

// Handle create add window
function createAddWindow() {
    // Create the browser window.
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item',
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    addWindow.loadFile('add-item.html');

    // Garbage collection handle
    addWindow.on('closed', function () {
        addWindow = null;
    });
};

// Catch item:add
ipcMain.on('item:add', function (event, item) {
    win.webContents.send('item:add', item);
    addWindow.close();
});

const mainMenuTemplate = [
    {
        label: "Edit",
        submenu: [
            {
                label: 'Add item',
                accelerator: process.platform === 'darwin' ? 'Command+A' : 'Ctrl+A',
                click(){ createAddWindow();
                }},
            { label: 'Clear item', click(){
                win.webContents.send('item:clear')
                } },
            { type: 'separator' },
            { role: 'about' },
            { role: 'quit' }
        ]
    }
]

// On Mac add empty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({ label: app.getName() });
}

if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+Q',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}