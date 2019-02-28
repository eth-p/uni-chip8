//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../App';
import Keybind from '../Keybind';

const settings = App.settings;
const state = App.state;
const emulator = App.emulator;

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Keybind: STEP_BACKWARDS
 * Steps the emulator backwards by one frame.
 * Also enables user pause.
 */
class KeybindPause extends Keybind {
	public onKeyDown(): void {
		if (!settings.enable_debugger) return;
		if (!state.emulator.loaded.value) return;

		state.user.pause.value = true;
		emulator.stepBackwards();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
export default KeybindPause;
export {KeybindPause};
