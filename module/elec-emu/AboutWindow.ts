//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {AbstractWindow} from './AbstractWindow';
import Injector from './Injector';
import {promisify} from 'util';
import * as fs from 'fs';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The about window of the application.
 */
class AboutWindowClass extends AbstractWindow {
	private styles?: string;

	protected _create() {
		const window = this.createWindow({
			width: 400,
			height: 500,
			minWidth: 400,
			minHeight: 400,
			darkTheme: true,
			...(process.platform === 'darwin'
				? {
						vibrancy: 'ultra-dark',
						titleBarStyle: 'hidden'
				  }
				: {})
		});

		window.loadFile('about.html');

		return window;
	}

	protected async _preload(): Promise<void> {
		const readFile = promisify(fs.readFile);

		let common = readFile('inject.css', 'utf8');
		let specific = readFile('inject-about.css', 'utf8');

		this.styles = `${await common}\n${await specific}`;
	}

	protected _inject(contents: any): void {
		contents.insertCSS(this.styles);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
const AboutWindow = new AboutWindowClass();
export default AboutWindow;
export {AboutWindow};
