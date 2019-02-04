//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import UIWindow from '@chipotle/web/UIWindow';
import dom_ready from '@chipotle/web/dom_ready';

import Savestate from './Savestate';

import {settings} from './settings';
import {emulator} from './instance';
// ---------------------------------------------------------------------------------------------------------------------
// Variables:
let savestate_window: UIWindow;
let control_savestates_show: Element[];
let control_savestates_hide: Element[];
let control_savestate_save: Element[];
let control_savestate_load: Element[];
let element_savestate_slots: Element[];

// ---------------------------------------------------------------------------------------------------------------------
// Functions:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Refreshes the savestate window.
 * This will update the preview images and timestamps.
 *
 * @param filter A filter for only refreshing specific savestate slots.
 */
export function refreshSavestateWindow(filter?: string[]) {
	for (let slot of element_savestate_slots) {
		let slotId = slot.getAttribute('data-savestate-slot')!;
		if (filter == null || !filter.includes(slotId)) continue;

		let savestate = <Savestate>(<any>settings)[`savestate_${slotId}`];
		if (savestate.unset === false) {
			slot.classList.remove('empty');

			let el_preview = slot.querySelector('img')!;
			let el_date = slot.querySelector('.date')!;

			el_date.textContent = savestate.date;
			el_preview.setAttribute('src', savestate.screenshot);
		} else {
			slot.classList.add('empty');
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Event Listeners:
// ---------------------------------------------------------------------------------------------------------------------

function saveSavestate(event: Event) {
	let element = <HTMLElement>event.target;

	if (event.target == null) return;
	if (element.getAttribute('data-savestate-slot') == null) return;

	emulator.snapshot(element.getAttribute('data-savestate-slot')!);
	savestate_window.hide();
}

function loadSavestate(event: Event) {
	let element = <HTMLElement>event.target;

	if (event.target == null) return;
	if (element.getAttribute('data-savestate-slot') == null) return;

	let slot = element.getAttribute('data-savestate-slot')!;
	let savestate = <Savestate>(<any>settings)[`savestate_${slot}`];
	if (savestate.unset === false) {
		emulator.restore(savestate.snapshot);
		savestate_window.hide();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Setup:
// ---------------------------------------------------------------------------------------------------------------------
dom_ready(() => {
	// Get HTML elements.
	savestate_window = new UIWindow(<HTMLElement>document.getElementById('emulator-savestates'));
	control_savestates_show = Array.from(document.querySelectorAll('[data-action="window-savestates-show"]'));
	control_savestates_hide = Array.from(document.querySelectorAll('[data-action="window-savestates-hide"]'));
	control_savestate_save = Array.from(document.querySelectorAll('[data-action="control-savestate-save"]'));
	control_savestate_load = Array.from(document.querySelectorAll('[data-action="control-savestate-load"]'));
	element_savestate_slots = Array.from(document.querySelectorAll('.savestate-slot'));

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

	control_savestate_save.forEach(btn => btn.addEventListener('click', saveSavestate));
	control_savestate_load.forEach(btn => btn.addEventListener('click', loadSavestate));

	// Refresh.
	refreshSavestateWindow();
	settings.addListener('update', (key, value) => {
		if (!key.startsWith('savestate_')) return;
		refreshSavestateWindow([key.substring('savestate_'.length)]);
	});
});
