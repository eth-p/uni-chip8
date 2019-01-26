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
let settings_window: UIWindow;
let settings_fields: HTMLInputElement[];
let control_show_settings: Element[];
let control_save_settings: Element[];
let control_cancel_settings: Element[];
let handlers: {[key: string]: SettingHandler} = {};

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
		let key = element.getAttribute('data-setting')!;
		let type = (element.getAttribute('data-setting-type') || element.getAttribute('type'))!;
		let entry = settings.getEntry(key);

		if (entry == null) {
			element.classList.add('WARNING--setting-not-configured');
			continue;
		}

		let handler = handlers[type];
		handler.load(settings, element, entry);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Key Display Map:
// ---------------------------------------------------------------------------------------------------------------------
let keymap: {[key: string]: string} = {
	',': 'Comma',
	'.': 'Period',
	' ': 'Space'
};

// ---------------------------------------------------------------------------------------------------------------------
// Handlers:
// ---------------------------------------------------------------------------------------------------------------------

type SettingHandler = {
	save: (settings: Settings, input: HTMLInputElement, setting: SettingsEntry) => boolean;
	load: (settings: Settings, input: HTMLInputElement, setting: SettingsEntry) => void;
};

/**
 * Number handler.
 * Expects input type number or input type text.
 */
handlers['number'] = {
	save: (settings: Settings, input: HTMLInputElement, setting: SettingsEntry) => {
		let value = parseInt(input.value, 10);

		if (isNaN(value)) return false;
		if (setting.validator != null && !setting.validator(value)) return false;

		settings.set(setting.name, value);
		return true;
	},

	load: (settings: any, input: HTMLInputElement, setting: SettingsEntry) => {
		input.value = settings.get(setting.name);
	}
};

/**
 * Color handler.
 * Expects input type color or input type text.
 */
handlers['color'] = {
	save: (settings: Settings, input: HTMLInputElement, setting: SettingsEntry) => {
		let value = input.value;

		if (!/^#[0-9a-fA-F]{6}$/.test(value)) return false;
		if (setting.validator != null && !setting.validator(value)) return false;

		settings.set(setting.name, value);
		return true;
	},

	load: (settings: Settings, input: HTMLInputElement, setting: SettingsEntry) => {
		input.value = settings.get(setting.name);
	}
};

/**
 * Checkbox handler.
 * Expects input type checkbox.
 */
handlers['checkbox'] = {
	save: (settings: Settings, input: HTMLInputElement, setting: SettingsEntry) => {
		let value = input.checked;

		if (setting.validator != null && !setting.validator(value)) return false;

		settings.set(setting.name, value);
		return true;
	},

	load: (settings: Settings, input: HTMLInputElement, setting: SettingsEntry) => {
		input.checked = settings.get(setting.name);
	}
};

/**
 * Keybind handler.
 * Expects input type text.
 */
handlers['keybind'] = {
	save: (settings: Settings, input: HTMLInputElement, setting: SettingsEntry) => {
		let value = input.value;
		let mapped = Object.entries(keymap).find(([pre, post]) => post === value);
		if (mapped != null) value = mapped[0];

		if (setting.validator != null && !setting.validator(value)) return false;

		settings.set(setting.name, value);
		return true;
	},

	load: (settings: Settings, input: HTMLInputElement, setting: SettingsEntry) => {
		let value = settings.get(setting.name);
		if (keymap[value] != null) value = keymap[value];
		input.value = value;
	}
};

// ---------------------------------------------------------------------------------------------------------------------
// Event Listeners:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An event listener that applies input changes to the settings.
 * @param event The input event.
 */
function changeListener(event: Event) {
	let element = <HTMLInputElement>event.target;
	let type = (element.getAttribute('data-setting-type') || element.getAttribute('type'))!;
	let key = element.getAttribute('data-setting')!;
	let entry = settings.getEntry(key);

	if (entry == null) {
		element.classList.add('WARNING--setting-not-configured');
		return;
	}

	let handler = handlers[type];
	if (handler.save(settings, element, entry)) {
		element.classList.remove('invalid');
	} else {
		element.classList.add('invalid');
	}
}

/**
 * An event listener that applies key press changes to the settings.
 * @param event The input event.
 */
function keyListener(event: KeyboardEvent) {
	let keydisplay = event.key;
	event.preventDefault();

	// Prevent certain keys.
	if (
		keydisplay === 'Meta' ||
		keydisplay === 'Control' ||
		keydisplay === 'Alt' ||
		event.metaKey ||
		event.altKey ||
		event.shiftKey
	)
		return;

	// Normalize the display text.
	if (keymap[keydisplay] != null) {
		keydisplay = keymap[keydisplay];
	}

	if (keydisplay.length === 1) {
		keydisplay = keydisplay.toUpperCase();
	}

	(<HTMLInputElement>event.target).value = keydisplay;
	changeListener(event);
	return false;
}

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

	// Add listeners.
	for (let settings_field of settings_fields) {
		switch (settings_field.getAttribute('data-setting-type')) {
			case 'keybind':
				settings_field.addEventListener('keydown', keyListener);
				break;

			default:
				settings_field.addEventListener('change', changeListener);
				break;
		}
	}

	// Show default.
	settingsUndo();
	settings_window.setPane('settings-general');
});
