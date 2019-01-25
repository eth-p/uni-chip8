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
let control_show_settings: Element[];
let control_save_settings: Element[];
let control_cancel_settings: Element[];
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
export function showPane(pane: SettingsPane) {
	for (let element of settings_panes) {
		element.classList.add('hide');
		if (element.id === pane) {
			element.classList.remove('hide');
		}
	}

	for (let element of settings_tabs) {
		element.classList.remove('active');
		if (element.getAttribute('data-pane') === pane) {
			element.classList.add('active');
		}
	}
}

/**
 * Shows the settings window.
 */
export function showSettings() {
	settings_overlay.classList.add('visible');
}

/**
 * Hides the settings window.
 */
export function hideSettings() {
	settings_overlay.classList.remove('visible');
}

export function settingsApply() {}

export function settingsCancel() {}

// Setup.
dom_ready(() => {
	// Get HTML elements.
	control_show_settings = Array.from(document.querySelectorAll('[data-action="emulator-settings-show"]'));
	control_save_settings = Array.from(document.querySelectorAll('[data-action="emulator-settings-save"]'));
	control_cancel_settings = Array.from(document.querySelectorAll('[data-action="emulator-settings-cancel"]'));
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
			showPane(<any>pane);
		}
	});

	// Add control button support.
	control_show_settings.forEach(btn => btn.addEventListener('click', () => showSettings()));

	control_cancel_settings.forEach(btn =>
		btn.addEventListener('click', () => {
			settingsCancel();
			hideSettings();
		})
	);

	control_save_settings.forEach(btn =>
		btn.addEventListener('click', () => {
			settingsApply();
			hideSettings();
		})
	);

	// Show default.
	showPane(SettingsPane.GENERAL);
});
