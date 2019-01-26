//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import UIWindow from '@chipotle/web/UIWindow';
import dom_ready from '@chipotle/web/dom_ready';
import settings from './settings';
// ---------------------------------------------------------------------------------------------------------------------
// Variables:
let settings_window: UIWindow;
let settings_fields: HTMLInputElement[];
let control_show_settings: Element[];
let control_save_settings: Element[];
let control_cancel_settings: Element[];
// ---------------------------------------------------------------------------------------------------------------------

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
	settings_fields = Array.from(document.querySelectorAll('input[data-setting]'));
	settings_window = new UIWindow(<HTMLElement>document.querySelector('#emulator-settings'));

	// Add control support.
	settings_fields.forEach(input => input.addEventListener('change', changeListener));
	control_show_settings.forEach(btn => btn.addEventListener('click', () => settings_window.show()));

	control_cancel_settings.forEach(btn =>
		btn.addEventListener('click', () => {
			settingsUndo();
			settings_window.hide();
		})
	);

	control_save_settings.forEach(btn =>
		btn.addEventListener('click', () => {
			settingsApply();
			settings_window.hide();
		})
	);

	// Show default.
	settingsUndo();
	settings_window.setPane('settings-general');
});
