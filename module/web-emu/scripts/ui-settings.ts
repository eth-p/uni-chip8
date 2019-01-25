//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import dom_ready from '@chipotle/web/dom_ready';
// ---------------------------------------------------------------------------------------------------------------------
// Variables:
let settings_overlay: Element;
let settings_tabs: Element[];
let settings_panes: Element[];
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An enum of valid settings panes.
 */
export enum SettingsPane {
	GENERAL = 'emulator-settings-pane-general',
	KEYBIND = 'emulator-settings-pane-keybind',
	DEBUG = 'emulator-settings-pane-debug'
}

/**
 * Shows a specific settings pane.
 * This will not throw any error if the pane is invalid.
 *
 * @param pane The pane to display.
 */
export function show(pane: SettingsPane) {
	for (let element of settings_panes) {
		element.classList.add('hide');
		if (element.id === pane) {
			element.classList.remove('hide');
		}
	}

	for (let element of settings_tabs) {
		element.classList.remove('active');
		console.log(element);
		if (element.getAttribute('data-pane') === pane) {
			element.classList.add('active');
		}
	}
}

// Setup.
dom_ready(() => {
	// Get HTML elements.
	settings_overlay = document.querySelector('#emulator-settings')!;

	settings_tabs = Array.from(settings_overlay.querySelectorAll('.desktop-window > .toolbar > .toolbar-item'));
	settings_panes = Array.from(settings_overlay.querySelectorAll('.desktop-window > .content > .section'));

	// Add tabbed pane support.
	const toolbar = settings_overlay.querySelector('.desktop-window > .toolbar')!;
	toolbar.addEventListener('click', evt => {
		if (evt.target == null) return;

		const target = <Element>evt.target;
		const pane = target.getAttribute('data-pane');
		if (pane != null) {
			show(<any>pane);
		}
	});

	// Show default.
	show(SettingsPane.GENERAL);
});
