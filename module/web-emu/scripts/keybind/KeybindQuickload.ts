//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../App';
import Keybind from '../Keybind';

const settings = App.settings;
const emulator = App.emulator;

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Keybind: QUICKLOAD
 * Loads the quicksave save state.
 */
class KeybindQuickLoad extends Keybind {
	public onKeyDown(): void {
		if (settings.savestate_quickslot == null) return;

		emulator.loadState(settings.savestate_quickslot);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default KeybindQuickLoad;
export {KeybindQuickLoad};
