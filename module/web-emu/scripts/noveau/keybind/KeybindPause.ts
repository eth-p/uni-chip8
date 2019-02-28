//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../App';
import Keybind from '../Keybind';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * An abstract class that specifies handler functions for keybinds.
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
