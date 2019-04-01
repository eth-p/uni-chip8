//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../App';
import Keybind from '../Keybind';

const settings = App.settings;
const state = App.state;

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Keybind: PAUSE
 * Toggles the user's pause state.
 */
class KeybindPause extends Keybind {
	public onKeyDown(): void {
		if (state.emulator.errored.value && !settings.enable_debugger) return;
		state.user.pause.value = !state.user.pause.value;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default KeybindPause;
export {KeybindPause};
