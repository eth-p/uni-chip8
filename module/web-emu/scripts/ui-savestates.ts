//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {XHR, XHRType} from '@chipotle/web/XHR';
import UIWindow from '@chipotle/web/UIWindow';
import dom_ready from '@chipotle/web/dom_ready';

import {show as showError} from './ui-error';
import {emulator} from './instance';
// ---------------------------------------------------------------------------------------------------------------------
// Variables:
let savestate_window: UIWindow;
let control_savestates_show: Element[];
let control_savestates_hide: Element[];

// ---------------------------------------------------------------------------------------------------------------------
// Event Listeners:
// ---------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------
// Setup:
// ---------------------------------------------------------------------------------------------------------------------
dom_ready(() => {
	// Get HTML elements.
	savestate_window = new UIWindow(<HTMLElement>document.getElementById('emulator-savestates'));
	control_savestates_show = Array.from(document.querySelectorAll('[data-action="window-savestates-show"]'));
	control_savestates_hide = Array.from(document.querySelectorAll('[data-action="window-savestates-hide"]'));

	// Add control support.
	control_savestates_hide.forEach(btn =>
		btn.addEventListener('click', () => {
			savestate_window.hide();
		})
	);

	control_savestates_show.forEach(btn =>
		btn.addEventListener('click', () => {
			savestate_window.show();
		})
	);
});
