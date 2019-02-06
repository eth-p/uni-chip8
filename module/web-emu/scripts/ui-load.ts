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
let load_list_tools: HTMLElement;
let load_list_games: HTMLElement;
let load_list_demos: HTMLElement;
let upload_input: HTMLInputElement;
let upload_box: HTMLLabelElement;
let control_load_show: Element[];
let control_load_hide: Element[];

// Types:
type DatabaseEntry = {name: string; info: string; author: string; author_url: string; type: 'GAME' | 'DEMO' | 'TOOL'};

// ---------------------------------------------------------------------------------------------------------------------
// Event Listeners:
// ---------------------------------------------------------------------------------------------------------------------
function uploadFile(file: File) {
	const reader = new FileReader();

	reader.onload = (event: any) => {
		emulator.load(new Uint8Array(event.target.result)).catch(error => {
			showError(error);
		});
	};

	reader.readAsArrayBuffer(file);
}

function uploadDrop(event: DragEvent): void {
	event.preventDefault();
	event.stopPropagation();

	if (event.dataTransfer!.files[0] instanceof Blob) {
		uploadFile(event.dataTransfer!.files[0]);
		load_window.hide();
	}
}

function uploadSelect(event: Event): void {
	uploadFile(upload_input.files![0]);
	load_window.hide();
}

function doNothing(event: Event & DragEvent): boolean {
	event.preventDefault();
	event.stopPropagation();

	if (event.dataTransfer != null) {
		event.dataTransfer.dropEffect = 'none';
	}

	return false;
}

// ---------------------------------------------------------------------------------------------------------------------
// Setup:
// ---------------------------------------------------------------------------------------------------------------------
dom_ready(() => {
	// Get HTML elements.
	control_load_show = Array.from(document.querySelectorAll('[data-action="window-load-show"]'));
	control_load_hide = Array.from(document.querySelectorAll('[data-action="window-load-hide"]'));
	load_window = new UIWindow(<HTMLElement>document.querySelector('#emulator-load'));
	load_list_games = document.getElementById('library-games')!;
	load_list_demos = document.getElementById('library-demos')!;
	load_list_tools = document.getElementById('library-tools')!;
	upload_input = <HTMLInputElement>document.getElementById('program-upload')!;
	upload_box = <HTMLLabelElement>document.getElementById('program-upload-display');

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

	load_window.getWindow().addEventListener('click', event => {
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

	// Add upload support.
	upload_box.addEventListener('drop', uploadDrop);
	upload_input.addEventListener('change', uploadSelect);
	upload_box.addEventListener('dragenter', doNothing);
	upload_box.addEventListener('dragover', e => {
		e.preventDefault();
		e.stopPropagation();
		e.dataTransfer!.dropEffect = 'copy';
	});

	// Disable drag and drop on the window itself.
	window.addEventListener('dragover', doNothing);
	window.addEventListener('drop', doNothing);

	// Show default.
	load_window.setPane('load-library-demos');

	// Load ROM database.
	new XHR('/assets/rom/database.json', XHRType.JSON).get().then(
		database => {
			let entries = <[string, DatabaseEntry][]>Object.entries(database);
			generateList(load_list_demos, entries.filter(([, entry]) => entry.type === 'DEMO'));
			generateList(load_list_games, entries.filter(([, entry]) => entry.type === 'GAME'));
			generateList(load_list_tools, entries.filter(([, entry]) => entry.type === 'TOOL'));
		},
		error => {
			console.error('FAILED TO LOAD ROM DATABASE');
			console.error(error);
			load_list_demos.textContent = 'Failed to load library.';
			load_list_games.textContent = 'Failed to load library.';
			load_list_tools.textContent = 'Failed to load library.';
		}
	);
});

function generateList(load_list: HTMLElement, database: [string, DatabaseEntry][]) {
	for (let [path, entry] of database) {
		let element = document.createElement('div');
		element.setAttribute('data-program-url', `/assets/rom/${path}`);
		element.classList.add('program-library-entry');

		let entry_name = document.createElement('div');
		entry_name.classList.add('program-library-entry-name');
		entry_name.textContent = entry.name;

		let entry_info = document.createElement('div');
		entry_info.classList.add('program-library-entry-info');
		entry_info.textContent = entry.info;

		let entry_author = document.createElement('a');
		entry_author.classList.add('program-library-entry-author');
		entry_author.setAttribute('href', entry.author_url);
		entry_author.textContent = entry.author;

		element.appendChild(entry_name);
		element.appendChild(entry_author);
		element.appendChild(entry_info);
		load_list.appendChild(element);
	}
}
