//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import settings from './settings';
import {emulator, vm} from './instance';
import Audio from './Audio';

// ---------------------------------------------------------------------------------------------------------------------
// Variables:
let audio: Audio;

// ---------------------------------------------------------------------------------------------------------------------
// Methods:
// ---------------------------------------------------------------------------------------------------------------------
/**
 * Stops all feedback.
 */
export function stopFeedback(): void {
	audio.stop();
}

/**
 * Vibrates the device.
 *
 * @param seconds The number of seconds to vibrate for.
 */
export function playFeedbackVibrate(seconds: number): void {
	// TODO
}

/**
 * Plays a beeping sound.
 *
 * @param seconds The number of seconds to play the sound for.
 */
export function playFeedbackSound(seconds: number): void {
	audio.beep(seconds);
}

// ---------------------------------------------------------------------------------------------------------------------
// Event Listeners:
// ---------------------------------------------------------------------------------------------------------------------
vm.addListener('sound', (cycles: number) => {
	let seconds = cycles / vm.TIMER_SPEED;
	if (settings.enable_feedback_vibrate) playFeedbackVibrate(seconds);
	if (settings.enable_feeback_sound) playFeedbackSound(seconds);
});

emulator.addListener('reset', () => {
	stopFeedback();
});

emulator.addListener('pause', () => {
	audio.pause();
});

emulator.addListener('resume', () => {
	audio.resume();
});

// ---------------------------------------------------------------------------------------------------------------------
// Setup:
// ---------------------------------------------------------------------------------------------------------------------
(() => {
	audio = new Audio();

	// If the context isn't running from the beginning, we hit the Chrome autoplay policy.
	// To remedy this, we need to resume it as a result of user input.
	if (audio.isBlocked()) {
		let events = ['mousedown', 'touchstart', 'input', 'click'];

		let setup = async function() {
			await audio.unblock();
			if (!audio.isBlocked()) {
				events.forEach(event => window.removeEventListener(event, setup));
			}
		};

		events.forEach(event => window.addEventListener(event, setup));
	}
})();

settings.addListener('update', (setting, value) => {
	switch (setting) {
		case 'sound_frequency':
			return audio.setFrequency(value);
		case 'sound_volume':
			return audio.setVolume(value);

		default:
			break;
	}
});
