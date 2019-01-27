//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import UIAnimator from '@chipotle/web/UIAnimator';
import dom_ready from '@chipotle/web/dom_ready';
import settings from './settings';
import {emulator, vm} from './instance';
// ---------------------------------------------------------------------------------------------------------------------
// Variables:
// ---------------------------------------------------------------------------------------------------------------------
let animator: UIAnimator<any>;
let element: HTMLElement;

let display_register_Vx: HTMLElement[];
let display_register_ST: HTMLElement;
let display_register_DT: HTMLElement;
let display_register_I: HTMLElement;
let display_register_PROGRAM: HTMLElement;

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Refreshes the component display.
 * This should be called during requestAnimationFrame.
 */
export function refresh() {
	if (!settings.show_registers) return;

	display_register_PROGRAM.innerText = vm.program_counter.toString(16).padStart(4, '0');
	display_register_I.innerText = vm.register_index.toString(16).padStart(4, '0');
	display_register_ST.innerText = vm.register_sound.toString(16).padStart(2, '0');
	display_register_DT.innerText = vm.register_timer.toString(16).padStart(2, '0');

	for (let i = 0, n = display_register_Vx.length; i < n; i++) {
		display_register_Vx[i].innerText = vm.register_data[i].toString(16).padStart(2, '0');
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
	element = <HTMLElement>document.querySelector('#emulator-registers')!;

	display_register_PROGRAM = <HTMLElement>(
		document.querySelector('[data-visualizer="register-PROGRAM"] .register-value')
	);
	display_register_I = <HTMLElement>document.querySelector('[data-visualizer="register-I"] .register-value');
	display_register_ST = <HTMLElement>document.querySelector('[data-visualizer="register-ST"] .register-value');
	display_register_DT = <HTMLElement>document.querySelector('[data-visualizer="register-DT"] .register-value');
	display_register_Vx = (<HTMLElement[]>Array.from(document.querySelectorAll('[data-visualizer]')))
		.map(el => [el, el.getAttribute('data-visualizer')!])
		.filter(([el, reg]) => (<string>reg).startsWith('register-V'))
		.map(([el, reg]) => [el, parseInt((<string>reg).substring('register-V'.length), 16)])
		.sort(([el1, reg1], [el2, reg2]) => <number>reg1 - <number>reg2)
		.map(([el, reg]) => <HTMLElement>(<HTMLElement>el).querySelector('.register-value'));

	animator = new UIAnimator(refresh, {visible: false, debugging: false, running: false});
	animator.resume();
});

settings.addListener('update', (setting, value) => {
	if (setting === 'show_registers') {
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

emulator.addListener('pause', () => {
	animator.setCriteria('running', false);
});

emulator.addListener('resume', () => {
	animator.setCriteria('running', true);
});
