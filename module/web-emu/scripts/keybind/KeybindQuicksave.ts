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
 * Keybind: QUICKSAVE
 * Saves the quicksave save state.
 */
class KeybindQuicksave extends Keybind {
	public onKeyDown(): void {
		if (!state.emulator.loaded.value) return;

		settings.savestate_quickslot = emulator.saveState();
		settings.save();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default KeybindQuicksave;
export {KeybindQuicksave};
