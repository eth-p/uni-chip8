//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {Settings, SettingsEntry} from '@chipotle/web/Settings';

import UIWindow from '@chipotle/web/UIWindow';
import dom_ready from '@chipotle/web/dom_ready';

import settings from './settings';
// ---------------------------------------------------------------------------------------------------------------------
// Variables:
let load_window: UIWindow;
let control_load_show: Element[];
let control_load_hide: Element[];

// ---------------------------------------------------------------------------------------------------------------------
// Setup:
// ---------------------------------------------------------------------------------------------------------------------
dom_ready(() => {
	// Get HTML elements.
	control_load_show = Array.from(document.querySelectorAll('[data-action="window-load-show"]'));
	control_load_hide = Array.from(document.querySelectorAll('[data-action="window-load-hide"]'));
	load_window = new UIWindow(<HTMLElement>document.querySelector('#emulator-load'));

	// Add control support.
	control_load_hide.forEach(btn =>
		btn.addEventListener('click', () => {
			load_window.hide();
		})
	);

	control_load_show.forEach(btn =>
		btn.addEventListener('click', () => {
			load_window.show();
		})
	);

	// Show default.
	load_window.setPane('load-library');
});
