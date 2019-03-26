//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import AbstractWindow from './AbstractWindow';
import Injector from './Injector';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The main window of the application.
 */
class MainWindowClass extends AbstractWindow {
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

	protected _execute(): string | null {
		return Injector.stylesheet('inject.css');
	}
}

// ---------------------------------------------------------------------------------------------------------------------
const MainWindow = new MainWindowClass();
export default MainWindow;
export {MainWindow};
