//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {URL} from 'url';
import * as Path from 'path';

const Electron = require('electron');
const BrowserWindow = Electron.BrowserWindow;
const Shell = Electron.shell;
type BrowserWindow = any;

// ---------------------------------------------------------------------------------------------------------------------

/**
 * An event handler to open links in an external browser.
 * @param event The event.
 * @param url The link URL.
 */
function external(event: any, url: string) {
	const parsed = new URL(url);
	const path = Path.normalize(unescape(parsed.pathname));

	if (parsed.protocol !== 'file' || !path.startsWith(__dirname)) {
		event.preventDefault();
		Shell.openExternal(url);
	}
}

/**
 * An abstract class for an Electron window.
 */
abstract class AbstractWindow {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected window?: BrowserWindow;

	// -------------------------------------------------------------------------------------------------------------
	// | Abstract:                                                                                                 |
	// -------------------------------------------------------------------------------------------------------------

	protected abstract _create(): BrowserWindow;

	protected _execute(): string | null {
		return null;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a BrowserWindow.
	 * This disabled node integration by default.
	 *
	 * @returns A new browser window.
	 */
	protected createWindow(options: any): BrowserWindow {
		return new BrowserWindow(
			Object.assign(
				{
					show: false,
					icon: Path.join(__dirname, 'assets', 'images', 'favicon.png')
				},
				options,
				{
					webPreferences: Object.assign(
						{},
						{
							nodeIntegration: false
						},
						options.webPreferences
					)
				}
			)
		);
	}

	/**
	 * Creates the window.
	 * This will do nothing if the window is already created.
	 */
	public create(): void {
		if (this.window != null) return;
		this.window = this._create();

		this.window.on('closed', () => {
			this.window = undefined;
		});

		const inject = () => {
			const js = this._execute();
			if (js != null) {
				this.window.webContents.executeJavaScript(js);
			}

			this.window.webContents.executeJavaScript("document.body.classList.add('electron')");
			this.window.webContents.executeJavaScript(
				`document.body.classList.add('electron-platform-${process.platform}')`
			);
		};

		this.window.webContents.on('dom-ready', inject);
		this.window.webContents.on('will-navigate', external);
		this.window.once('ready-to-show', () => this.window.show());
	}

	/**
	 * Checks if the window is created.
	 * @returns True if the window is created, false otherwise.
	 */
	public isCreated(): boolean {
		return this.window != null;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default AbstractWindow;
export {AbstractWindow, BrowserWindow};
