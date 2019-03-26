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
		let path = Path.normalize(unescape(parsed.pathname));

		if (process.platform === 'win32') {
			path = path.substring(path.search(/[^\/\\]/));
		}

		if (path.startsWith(__dirname)) {
			return callback({path});
		}

		if (process.platform === 'win32') {
			path = path.substring(path.indexOf(':') + 1);
		}

		callback({path: Path.normalize(Path.join(__dirname, path))});
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
