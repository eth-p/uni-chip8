//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {toHexString as u16_toHexString} from '@chipotle/types/Uint16';
import {toHexString as u8_toHexString} from '@chipotle/types/Uint8';
import UIAnimator from '@chipotle/web/UIAnimator';
import dom_ready from '@chipotle/web/dom_ready';
import settings from './settings';
import {emulator, vm} from './instance';
// ---------------------------------------------------------------------------------------------------------------------
// Variables:
// ---------------------------------------------------------------------------------------------------------------------
let animator: UIAnimator<any>;
let element: HTMLElement;

let display_frame_pc: HTMLElement;
let display_frames: HTMLElement[];

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Refreshes the component display.
 * This should be called during requestAnimationFrame.
 */
export function refresh() {
	if (!settings.show_stack) return;

	display_frame_pc.textContent = u16_toHexString(vm.program_counter);

	let stack = vm.stack.inspect();
	let stackEnd = stack.length - 1;
	for (let i = 0, n = display_frames.length; i < n; i++) {
		let element = display_frames[i];
		let parent = <HTMLElement>element.parentNode;
		if (i > stackEnd) {
			if (!parent.classList.contains('unused')) {
				element.textContent = '----';
				parent.classList.add('unused');
			}
		} else {
			element.textContent = u16_toHexString(stack[stackEnd - i]);
			parent.classList.remove('unused', 'template');
		}
	}
}

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
		animator.setCriteria('visible', true);
		element.classList.remove('hide');
	} else {
		animator.setCriteria('visible', false);
		element.classList.add('hide');
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Setup:
// ---------------------------------------------------------------------------------------------------------------------
dom_ready(() => {
	element = <HTMLElement>document.querySelector('#emulator-stack')!;
	display_frames = [];
	display_frame_pc = <HTMLElement>element.querySelector('.stack-frame[data-stack-frame="PC"] .stack-frame-value');

	// Create display elements.
	let container = <HTMLElement>element.querySelector('.stack-visualizer');
	let template = <HTMLElement>element.querySelector('.stack-frame.template');
	for (let i = 0; i < vm.MAX_STACK; i++) {
		let copy = <HTMLElement>template.cloneNode(true);

		// Set text.
		let label = <HTMLElement>copy.querySelector('.stack-frame-index');
		let display = <HTMLElement>copy.querySelector('.stack-frame-value');
		label.textContent = `-${u8_toHexString(i + 1)}`;
		display.textContent = '----';

		// Add display.
		display_frames.push(display);
		container.appendChild(copy);
	}

	// Setup animator.
	animator = new UIAnimator(refresh, {visible: false, debugging: false, running: false});
	animator.resume();
});

settings.addListener('update', (setting, value) => {
	if (setting === 'show_stack') {
		setVisible(value);
		return;
	}

	if (setting === 'enable_debugger') {
		animator.setCriteria('debugging', value);
	}
});

emulator.addListener('step', () => {
	animator.run();
});

emulator.addListener('reset', () => {
	animator.run();
});

emulator.addListener('pause', () => {
	animator.setCriteria('running', false);
});

emulator.addListener('resume', () => {
	animator.setCriteria('running', true);
});
