//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import dom_ready from '@chipotle/web/dom_ready';

import {emulator, vm} from './instance';
// ---------------------------------------------------------------------------------------------------------------------
// Variables:
let controls_playpause: HTMLElement[];
let controls_play: HTMLElement[];
let controls_pause: HTMLElement[];
let controls_reset: HTMLElement[];
let controls_step_forwards: HTMLElement[];
let controls_step_backwards: HTMLElement[];

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Invalidates cached data.
 */
export function invalidate() {
	controls_playpause = Array.from(document.querySelectorAll('[data-action="emulator-play-pause"]'));
	controls_play = Array.from(document.querySelectorAll('[data-action="emulator-play"]'));
	controls_pause = Array.from(document.querySelectorAll('[data-action="emulator-pause"]'));
	controls_reset = Array.from(document.querySelectorAll('[data-action="emulator-reset"]'));
	controls_step_backwards = Array.from(document.querySelectorAll('[data-action="emulator-debug-step-prev"]'));
	controls_step_forwards = Array.from(document.querySelectorAll('[data-action="emulator-debug-step-next"]'));

	hookevts(controls_playpause, controlPlayPause);
	hookevts(controls_play, controlPlay);
	hookevts(controls_pause, controlPause);
	hookevts(controls_reset, controlReset);
	hookevts(controls_step_forwards, controlStepForwards);
	hookevts(controls_step_backwards, controlStepBackwards);

	function hookevts(elements: HTMLElement[], listener: Function) {
		for (let element of elements) {
			element.removeEventListener('click', <any>listener);
			element.addEventListener('click', <any>listener);
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Functions:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Checks the pause/resume state of the emulator and updates any toggle controls accordingly.
 */
function checkPauseToggle() {
	let label = emulator.isPaused() ? 'Resume' : 'Pause';
	for (let element of controls_playpause) {
		if (element instanceof HTMLInputElement) {
			element.value = label;
		} else {
			element.innerText = label;
		}
	}
}

/**
 * Checks if a program is loaded, and enables/disables any controls accordingly.
 */
function checkProgram() {
	let disabled = vm.program.data == null;

	function setElementDisabled(element: HTMLElement) {
		if (element instanceof HTMLInputElement) {
			element.disabled = disabled;
		}
	}

	controls_play.forEach(setElementDisabled);
	controls_playpause.forEach(setElementDisabled);
	controls_pause.forEach(setElementDisabled);
	controls_step_forwards.forEach(setElementDisabled);
	controls_step_backwards.forEach(setElementDisabled);
	controls_reset.forEach(setElementDisabled);
}

// ---------------------------------------------------------------------------------------------------------------------
// Event Listeners:
// ---------------------------------------------------------------------------------------------------------------------

function controlPlayPause() {
	if (emulator.isPaused()) {
		emulator.resume();
	} else {
		emulator.pause();
	}
}

function controlPlay() {
	emulator.resume();
}

function controlPause() {
	emulator.pause();
}

function controlReset() {
	emulator.reset();
}

function controlStepForwards() {
	emulator.stepForwards();
}

function controlStepBackwards() {
	emulator.stepBackwards();
}

// ---------------------------------------------------------------------------------------------------------------------
// Setup:
// ---------------------------------------------------------------------------------------------------------------------
dom_ready(() => {
	invalidate();

	emulator.addListener('pause', checkPauseToggle);
	emulator.addListener('resume', checkPauseToggle);
	checkPauseToggle();
	checkProgram();
});
