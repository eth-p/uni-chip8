//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import dom_ready from '@chipotle/web/dom_ready';
import settings from './settings';
// ---------------------------------------------------------------------------------------------------------------------
// Variables:
// ---------------------------------------------------------------------------------------------------------------------
let element: HTMLElement;

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Refreshes the component display.
 * This should be called during requestAnimationFrame.
 */
export function refresh() {
	if (!settings.show_registers) return;

	// TODO
}

/**
 * Hides the component.
 */
export function hide(): void {
	element.classList.add('hide');
}

/**
 * Shows the component.
 */
export function show(): void {
	element.classList.remove('hide');
}

/**
 * Sets the visibility of the component.
 * @param visible True if the component should be visible.
 */
export function setVisible(visible: boolean): void {
	if (visible) {
		show();
	} else {
		hide();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Setup:
// ---------------------------------------------------------------------------------------------------------------------
dom_ready(() => {
	element = <HTMLElement>document.querySelector('#emulator-registers')!;
	setVisible(settings.show_registers!);
});

settings.addListener('update', (setting, value) => {
	if (setting !== 'show_registers') return;
	setVisible(value);
});
