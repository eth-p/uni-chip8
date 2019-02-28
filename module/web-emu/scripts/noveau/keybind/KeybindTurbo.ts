//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../App';
import Keybind from '../Keybind';

const state = App.state;

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Keybind: TURBO
 * Enables turbo mode while pressed.
 */
class KeybindPause extends Keybind {
	public onKeyDown(): void {
		state.user.turbo.value = true;
	}

	public onKeyUp(): void {
		state.user.turbo.value = false;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
export default KeybindPause;
export {KeybindPause};
