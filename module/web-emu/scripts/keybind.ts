//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '@chipotle/types/assert';

import settings from './settings';
import {emulator} from './instance';

// ---------------------------------------------------------------------------------------------------------------------
// Variables:
let handlers: {[key: string]: KeyHandler} = {};
let handlersCache: Map<string, KeyHandler> = new Map();
let keybindsEnabled: boolean = true;

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Sets whether or not keybinds are enabled.
 * @param enabled True if keybinds are enabled.
 */
export function setEnabled(enabled: boolean): void {
	keybindsEnabled = enabled;
}

// ---------------------------------------------------------------------------------------------------------------------
// Handlers:
// ---------------------------------------------------------------------------------------------------------------------

type KeyHandler = {
	keydown: () => void;
	keyup: () => void;
};

handlers['keybind_control_pause'] = {
	keyup: () => {},
	keydown: () => {
		if (emulator.isPaused()) {
			emulator.resume();
		} else {
			emulator.pause();
		}
	}
};

handlers['keybind_control_turbo'] = {
	keyup: () => {
		emulator.setTurbo(false);
	},
	keydown: () => {
		emulator.setTurbo(true);
	}
};

handlers['keybind_control_step_prev'] = {
	keyup: () => {},
	keydown: () => {
		// FIXME: @eth-p: Implement step backwards.
		// if (!settings.enable_debugger) return;
		// emulator.stepBackwards();
	}
};

handlers['keybind_control_step_next'] = {
	keyup: () => {},
	keydown: () => {
		if (!settings.enable_debugger) return;
		emulator.stepForwards();
	}
};

// Keys 0-F
for (let i = 0; i <= 0xf; i++) {
	let key = i.toString(16).toUpperCase();
	handlers[`keybind_key_${key}`] = {
		keyup: () => emulator.keyup(key),
		keydown: () => emulator.keydown(key)
	};
}

// ---------------------------------------------------------------------------------------------------------------------
// Event Listeners:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Handles a key state.
 *
 * @param key The key.
 * @param state The key state.
 *
 * @returns True if the key event is handled.
 */
function handle(key: string, state: boolean): boolean {
	let keyname = key.length === 1 ? key.toUpperCase() : key;

	let handler = handlersCache.get(keyname);
	if (handler == null) return false;

	if (state) {
		handler.keydown();
	} else {
		handler.keyup();
	}

	return true;
}

window.addEventListener('keydown', event => {
	if (!keybindsEnabled) return;
	if (event.metaKey || event.ctrlKey || event.altKey) return;
	if (event.target instanceof HTMLInputElement && event.target.getAttribute('type') !== 'button') return;
	if (handle(event.key, true)) {
		event.preventDefault();
		return;
	}
});

window.addEventListener('keyup', event => {
	if (!keybindsEnabled) return;
	if (event.metaKey || event.ctrlKey || event.altKey) return;
	if (event.target instanceof HTMLInputElement && event.target.getAttribute('type') !== 'button') return;
	if (handle(event.key, false)) {
		event.preventDefault();
		return;
	}
});

// ---------------------------------------------------------------------------------------------------------------------
// Setup:
// ---------------------------------------------------------------------------------------------------------------------

settings.addListener('update', (setting: string) => {
	if (!setting.startsWith('keybind_')) return;

	handlersCache.clear();
	for (let keybind of settings.getKeys().filter(s => s.startsWith('keybind_'))) {
		let handler = handlers[keybind];
		handlersCache.set(settings.get(keybind), handler);

		assert(handler != null, `No handler defined for keybind: ${keybind}`);
	}
});
