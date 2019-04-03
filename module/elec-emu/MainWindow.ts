//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import AbstractWindow from './AbstractWindow';
import Injector from './Injector';

import * as fs from 'fs';
import {promisify} from 'util';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The main window of the application.
 */
class MainWindowClass extends AbstractWindow {
	private styles?: string;

	protected _create() {
		const window = this.createWindow({
			width: 800,
			height: 600,
			minWidth: 400,
			minHeight: 400,
			darkTheme: true,
			...(process.platform === 'darwin'
				? {
						titleBarStyle: 'hidden'
				  }
				: {})
		});

		window.loadFile('emulator/index.html');

		return window;
	}

	protected async _preload(): Promise<void> {
		const readFile = promisify(fs.readFile);

		let common = readFile('inject.css', 'utf8');
		let specific = readFile('inject-emulator.css', 'utf8');

		this.styles = `${await common}\n${await specific}`;
	}

	protected _inject(contents: any): void {
		contents.insertCSS(this.styles);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
const MainWindow = new MainWindowClass();
export default MainWindow;
export {MainWindow};
