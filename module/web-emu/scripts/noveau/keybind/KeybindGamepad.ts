//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../App';
import AppSettings from '../AppSettings';
import Keybind from '../Keybind';

const emulator = App.emulator;

// ---------------------------------------------------------------------------------------------------------------------

/**
 * Keybind: KEY_X
 * Toggles the user's pause state.
 */
class KeybindPause extends Keybind {
	// -------------------------------------------------------------------------------------------------------------
	// Fields:                                                                                                     |
	// -------------------------------------------------------------------------------------------------------------

	public readonly keynum: string;

	// -------------------------------------------------------------------------------------------------------------
	// Constructors:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new keybind for the gamepad.
	 *
	 * @param setting The setting key for the keybind.
	 * @param keynum The gamepad key number.
	 */
	public constructor(setting: AppSettings.Keys, keynum: string) {
		super(setting);
		this.keynum = keynum;
	}

	// -------------------------------------------------------------------------------------------------------------
	// Implementation:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public onKeyDown(): void {
		emulator.keydown(this.keynum);
	}

	public onKeyUp(): void {
		emulator.keyup(this.keynum);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
export default KeybindPause;
export {KeybindPause};
