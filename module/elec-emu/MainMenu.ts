//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
const Electron = require('electron');
const Menu = Electron.Menu;
const MenuItem = Electron.MenuItem;

import AboutWindow from './AboutWindow';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * The main window of the application.
 */
class MainMenu {
	protected static createAbout(): any {
		return new MenuItem({
			label: 'About CHIP-8',
			click: () => {
				AboutWindow.create();
			}
		});
	}

	public static create(): any {
		const template = [
			{
				label: 'Edit',
				submenu: [
					{role: 'undo'},
					{role: 'redo'},
					{type: 'separator'},
					{role: 'cut'},
					{role: 'copy'},
					{role: 'paste'},
					{role: 'delete'},
					{role: 'selectall'}
				]
			},
			{
				label: 'View',
				submenu: [
					{role: 'resetzoom'},
					{role: 'zoomin'},
					{role: 'zoomout'},
					{type: 'separator'},
					{role: 'togglefullscreen'}
				]
			},
			{
				role: 'window',
				submenu: [{role: 'minimize'}, {role: 'close'}]
			},
			{
				role: 'help',
				submenu: [this.createAbout(), {role: 'toggledevtools'}]
			}
		];

		if (process.platform === 'darwin') {
			template.unshift({
				label: 'CHIP-8 Emulator',
				submenu: [
					this.createAbout(),
					{type: 'separator'},
					{role: 'services'},
					{type: 'separator'},
					{role: 'hide'},
					{role: 'hideothers'},
					{role: 'unhide'},
					{type: 'separator'},
					{role: 'quit'}
				]
			});

			// Edit menu
			template[1].submenu.push();

			// Window menu
			template[3].submenu = [
				{role: 'close'},
				{role: 'minimize'},
				{role: 'zoom'},
				{type: 'separator'},
				{role: 'front'}
			];

			// Help menu
			template[4].submenu.shift();
		}

		return Menu.buildFromTemplate(template);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default MainMenu;
export {MainMenu};
