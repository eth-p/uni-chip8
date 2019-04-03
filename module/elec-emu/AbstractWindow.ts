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
type WebContents = any;

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
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		AbstractWindow.instances.push(this);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Abstract:                                                                                                 |
	// -------------------------------------------------------------------------------------------------------------

	protected abstract _create(): BrowserWindow;

	protected async _preload(): Promise<void> {}

	protected _inject(contents: WebContents): void {}

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
			this.window.webContents.executeJavaScript("document.body.classList.add('electron')");
			this.window.webContents.executeJavaScript(
				`document.body.classList.add('electron-platform-${process.platform}')`
			);

			this._inject(this.window.webContents);
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

	// -------------------------------------------------------------------------------------------------------------
	// | Static:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	private static instances: AbstractWindow[] = [];

	/**
	 * Preloads injection data.
	 */
	public static async preload(): Promise<void> {
		await Promise.all(AbstractWindow.instances.map(i => i._preload()));
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default AbstractWindow;
export {AbstractWindow, BrowserWindow};
