//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {AbstractWindow} from './AbstractWindow';
import Injector from './Injector';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The about window of the application.
 */
class AboutWindowClass extends AbstractWindow {
	protected _create() {
		const window = this.createWindow({
			width: 400,
			height: 400,
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

	protected _execute(): string | null {
		return Injector.stylesheet('inject.css') + Injector.stylesheet('inject-about.css');
	}
}

// ---------------------------------------------------------------------------------------------------------------------
const AboutWindow = new AboutWindowClass();
export default AboutWindow;
export {AboutWindow};
