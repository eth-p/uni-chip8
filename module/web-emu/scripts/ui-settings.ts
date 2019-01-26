//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import dom_ready from '@chipotle/web/dom_ready';
import settings from './settings';
// ---------------------------------------------------------------------------------------------------------------------
// Variables:
let settings_overlay: Element;
let settings_tabs: Element[];
let settings_panes: Element[];
let settings_fields: HTMLInputElement[];
let control_show_settings: Element[];
let control_save_settings: Element[];
let control_cancel_settings: Element[];
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An enum of valid settings panes.
 */
export enum SettingsPane {
	GENERAL = 'settings-pane-general',
	KEYBIND = 'settings-pane-keybind',
	DEBUG = 'settings-pane-debug'
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

/**
 * Applies the changed settings.
 */
export function settingsApply() {
	settings.save();
}

/**
 * Cancels the changed settings.
 */
export function settingsUndo() {
	settings.load();
	for (let element of settings_fields) {
		let setting = element.getAttribute('data-setting')!;
		let value = (<any>settings)[setting];
		switch (element.getAttribute('type')) {
			case 'checkbox':
				element.checked = value;
				break;

			default:
				element.value = value;
				break;
		}
	}
}

function changeListener(event: Event) {
	let input = <HTMLInputElement>event.target;
	let type = input.getAttribute('type')!;
	let value: any = input.value;
	input.classList.remove('invalid');

	switch (type) {
		case 'number':
			if (!/^[\d]+$/.test(value)) {
				input.classList.add('invalid');
				return;
			}

			value = parseInt(value, 10);
			break;

		case 'color':
			if (!/^#[0-9a-fA-F]{6}$/.test(value)) {
				input.classList.add('invalid');
				return;
			}
			break;

		case 'checkbox':
			value = input.checked;
			break;

		default:
			break;
	}

	(<any>settings)[input.getAttribute('data-setting')!] = value;
}

// ---------------------------------------------------------------------------------------------------------------------
// Handlers:
// ---------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------
// Setup:
// ---------------------------------------------------------------------------------------------------------------------
dom_ready(() => {
	// Get HTML elements.
	control_show_settings = Array.from(document.querySelectorAll('[data-action="window-settings-show"]'));
	control_save_settings = Array.from(document.querySelectorAll('[data-action="settings-save"]'));
	control_cancel_settings = Array.from(document.querySelectorAll('[data-action="settings-cancel"]'));
	settings_overlay = document.querySelector('#emulator-settings')!;
	settings_tabs = Array.from(settings_overlay.querySelectorAll('.desktop-window > .toolbar > .toolbar-item'));
	settings_panes = Array.from(settings_overlay.querySelectorAll('.desktop-window > .content > .section'));
	settings_fields = Array.from(document.querySelectorAll('input[data-setting]'));

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

	// Add control support.
	settings_fields.forEach(input => input.addEventListener('change', changeListener));
	control_show_settings.forEach(btn => btn.addEventListener('click', () => showSettings()));

	control_cancel_settings.forEach(btn =>
		btn.addEventListener('click', () => {
			settingsUndo();
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
	settingsUndo();
	showPane(SettingsPane.GENERAL);
});
