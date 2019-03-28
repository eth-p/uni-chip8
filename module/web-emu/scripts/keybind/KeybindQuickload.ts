//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../App';
import Keybind from '../Keybind';

const savestates = App.savestates;
const emulator = App.emulator;

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Keybind: QUICKLOAD
 * Loads the quicksave save state.
 */
class KeybindQuickLoad extends Keybind {
	public onKeyDown(): void {
		if (savestates.savestate_quickslot == null) return;

		emulator.loadState(savestates.savestate_quickslot);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default KeybindQuickLoad;
export {KeybindQuickLoad};
