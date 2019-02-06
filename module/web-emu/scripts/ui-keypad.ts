//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import dom_ready from '@chipotle/web/dom_ready';

import settings from './settings';
import {emulator} from './instance';
// ---------------------------------------------------------------------------------------------------------------------
// Variables:
// ---------------------------------------------------------------------------------------------------------------------
let element: HTMLElement;
let keys: HTMLElement[];

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Hides the component.
 */
export function hide(): void {
	setVisible(true);
}

/**
 * Shows the component.
 */
export function show(): void {
	setVisible(false);
}

/**
 * Sets the visibility of the component.
 * @param visible True if the component should be visible.
 */
export function setVisible(visible: boolean): void {
	if (element == null) {
		setTimeout(() => setVisible(visible), 10);
		return;
	}

	if (visible) {
		element.classList.remove('hide');
	} else {
		element.classList.add('hide');
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Event Listeners:
// ---------------------------------------------------------------------------------------------------------------------
function onDown(key: string) {
	emulator.keydown(key);
}

function onUp(key: string) {
	emulator.keyup(key);
}

function eventWrapper(handler: (key: string) => void) {
	return function(event: MouseEvent | TouchEvent) {
		if (event.target == null) return;

		let action = (<HTMLElement>event.target).getAttribute('data-action');
		if (action == null || !action.startsWith('emulator-key-')) return;

		handler(action.substring('emulator-key-'.length));
		event.preventDefault();
		event.stopImmediatePropagation();
		return false;
	};
}

// ---------------------------------------------------------------------------------------------------------------------
// Setup:
// ---------------------------------------------------------------------------------------------------------------------
dom_ready(() => {
	element = <HTMLElement>document.querySelector('#emulator-keypad')!;
	keys = (<HTMLElement[]>Array.from(element.querySelectorAll('[data-action]')))
		.filter(el => el.getAttribute('data-action')!.startsWith('emulator-key-'))
		.sort((el1, el2) => {
			let el1k = parseInt(el1.getAttribute('data-action')!.substring('emulator-key-'.length), 16);
			let el2k = parseInt(el2.getAttribute('data-action')!.substring('emulator-key-'.length), 16);
			return el1k - el2k;
		});

	// Ignore click events, since they don't help track up/down state.
	element.addEventListener('click', event => {
		event.preventDefault();
		event.stopImmediatePropagation();
	});

	// Handle mouse events.
	element.addEventListener(
		'mousedown',
		eventWrapper(key => {
			onDown(key);
		})
	);

	element.addEventListener(
		'mouseup',
		eventWrapper(key => {
			onUp(key);
		})
	);

	// Handle touch events.
	element.addEventListener(
		'touchstart',
		eventWrapper(key => {
			onDown(key);
		})
	);

	element.addEventListener(
		'touchend',
		eventWrapper(key => {
			onUp(key);
		})
	);
});

emulator.addListener('keydown', key => {
	window.requestAnimationFrame(() => {
		keys[parseInt(key, 16)].classList.add('pressed');
	});
});

emulator.addListener('keyup', key => {
	window.requestAnimationFrame(() => {
		keys[parseInt(key, 16)].classList.remove('pressed');
	});
});

settings.addListener('update', (setting, value) => {
	if (setting === 'show_keypad') {
		setVisible(value);
	}
});
