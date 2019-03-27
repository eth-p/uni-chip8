//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../App';
import Keybind from '../Keybind';

const savestates = App.savestates;
const state = App.state;
const emulator = App.emulator;

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Keybind: QUICKSAVE
 * Saves the quicksave save state.
 */
class KeybindQuicksave extends Keybind {
	public onKeyDown(): void {
		if (!state.emulator.loaded.value) return;

		savestates.savestate_quickslot = emulator.saveState();
		savestates.save();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default KeybindQuicksave;
export {KeybindQuicksave};
