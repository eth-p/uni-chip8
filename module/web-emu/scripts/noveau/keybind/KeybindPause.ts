//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../App';
import Keybind from '../Keybind';

const state = App.state;

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Keybind: PAUSE
 * Toggles the user's pause state.
 */
class KeybindPause extends Keybind {
	public onKeyDown(): void {
		App.state.user.pause.value = !App.state.user.pause.value;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
export default KeybindPause;
export {KeybindPause};
