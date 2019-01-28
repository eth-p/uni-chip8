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
let load_window: UIWindow;
let load_list: HTMLElement;
let load_list_message: HTMLElement;
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
	load_list = <HTMLElement>document.querySelector('#emulator-load .load-library-list')!;
	load_list_message = <HTMLElement>document.querySelector('#emulator-load .load-library-list-loading')!;

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

	load_list.addEventListener('click', event => {
		let target = <HTMLElement | null>event.target;
		if (target == null) return;
		if (target.getAttribute('href') != null) return;
		if (target.getAttribute('data-program-url') == null) target = <HTMLElement>target.parentNode!;
		if (target.getAttribute('data-program-url') == null) return;

		load_window.hide();
		new XHR(target.getAttribute('data-program-url')!, XHRType.BINARY)
			.get()
			.then(data => {
				return emulator.load(data);
			})
			.catch(error => {
				showError(error);
			});
	});

	// Show default.
	load_window.setPane('load-library');

	// Load ROM database.
	new XHR('/assets/rom/database.json', XHRType.JSON).get().then(
		database => {
			load_list_message.parentNode!.removeChild(load_list_message);
			generateList(database);
		},
		error => {
			console.error('FAILED TO LOAD ROM DATABASE');
			console.error(error);
			load_list_message.textContent = 'Failed to load library.';
		}
	);
});

function generateList(database: {[key: string]: {name: string; info: string; author: string; author_url: string}}) {
	for (let [path, entry] of Object.entries(database)) {
		let element = document.createElement('div');
		element.setAttribute('data-program-url', `/assets/rom/${path}`);
		element.classList.add('load-library-entry');

		let entry_name = document.createElement('div');
		entry_name.classList.add('load-library-entry-name');
		entry_name.textContent = entry.name;

		let entry_info = document.createElement('div');
		entry_info.classList.add('load-library-entry-info');
		entry_info.textContent = entry.info;

		let entry_author = document.createElement('a');
		entry_author.classList.add('load-library-entry-author');
		entry_author.setAttribute('href', entry.author_url);
		entry_author.textContent = entry.author;

		element.appendChild(entry_name);
		element.appendChild(entry_author);
		element.appendChild(entry_info);
		load_list.appendChild(element);
	}
}
