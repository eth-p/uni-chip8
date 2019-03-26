//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
const Electron = require('electron');
const Application = Electron.app;

import * as Path from 'path';
import {URL} from 'url';

import MainWindow from './MainWindow';
import MainMenu from './MainMenu';

// ---------------------------------------------------------------------------------------------------------------------
// Main:
// ---------------------------------------------------------------------------------------------------------------------

function intercept() {
	Electron.protocol.interceptFileProtocol('file', (req: any, callback: any) => {
		const parsed = new URL(req.url);
		const path = Path.normalize(unescape(parsed.pathname));

		if (path.startsWith(__dirname)) {
			return callback({path});
		}

		callback({path: Path.normalize(Path.join(__dirname, parsed.pathname))});
	});
}

Application.on('ready', () => {
	intercept();

	Application.setApplicationMenu(MainMenu.create());
	MainWindow.create();
});

Application.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		Application.quit();
	}
});

Application.on('activate', function() {
	if (!MainWindow.isCreated()) {
		MainWindow.create();
	}
});
