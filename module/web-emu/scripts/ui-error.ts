//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import ProgramError from '@chipotle/vm/ProgramError';
import VMError from '@chipotle/vm/VMError';
import UIWindow from '@chipotle/web/UIWindow';
import dom_ready from '@chipotle/web/dom_ready';

import {emulator} from './instance';
// ---------------------------------------------------------------------------------------------------------------------
// Variables:
let error_window: UIWindow;
let error_summary: HTMLElement;
let error_stack: HTMLElement;

// ---------------------------------------------------------------------------------------------------------------------
// Export:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Shows the error window with an error.
 * @param error The error to show.
 */
export function show(error: Error) {
	if (error instanceof ProgramError) {
		showProgramError(error);
	} else if (error instanceof VMError) {
		showVMError(error);
	} else {
		showError(error);
	}

	document.querySelectorAll('.desktop-overlay').forEach(e => e.classList.remove('visible'));
	error_window.show();
}

// ---------------------------------------------------------------------------------------------------------------------
// Functions:
// ---------------------------------------------------------------------------------------------------------------------

function showProgramError(error: ProgramError) {
	error_window.setTitle('The CHIP-8 Program Crashed');

	switch (error.message) {
		case ProgramError.UNKNOWN_OPCODE:
			error_summary.innerText = 'The program executed an invalid opcode.';
			break;

		case ProgramError.STACK_UNDERFLOW:
			error_summary.innerText = 'The program call stack underflowed.';
			break;

		case ProgramError.STACK_OVERFLOW:
			error_summary.innerText = 'The program call stack overflowed.';
			break;

		case ProgramError.ROM_TOO_LARGE:
			error_summary.innerText = 'The program ROM is too large to be a CHIP-8 ROM.';
			break;

		default:
			error_summary.innerText = `An unexpected error ${error.name} occurred.`;
			break;
	}

	error_stack.innerText = error.stack || 'No stack trace available.';
}

function showVMError(error: VMError) {
	error_window.setTitle('Virtual Machine Error');
	error_summary.innerText = 'The virtual machine encountered an error.';
	error_stack.innerText = error.stack || 'No stack trace available.';
}

function showError(error: Error) {
	error_window.setTitle('Unexpected Error');
	error_summary.innerText = 'Something unexpected caused an error.';
	error_stack.innerText = error.stack || 'No stack trace available.';
}

// ---------------------------------------------------------------------------------------------------------------------
// Setup:
// ---------------------------------------------------------------------------------------------------------------------
dom_ready(() => {
	error_window = new UIWindow(<HTMLElement>document.querySelector('#emulator-error'));
	error_summary = <HTMLElement>error_window.getWindow().querySelector('.error-summary');
	error_stack = <HTMLElement>error_window.getWindow().querySelector('.error-stack');

	document.querySelectorAll('[data-action="error-close"]').forEach(element => {
		element.addEventListener('click', () => error_window.hide());
	});

	emulator.addListener('error', error => {
		show(error);
	});
});