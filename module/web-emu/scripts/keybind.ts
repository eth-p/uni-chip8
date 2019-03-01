//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from './noveau/App';
import StateProvider from '@chipotle/wfw/StateProvider';

// ---------------------------------------------------------------------------------------------------------------------
// Variables:
let keybindsEnabled: StateProvider<boolean> = new StateProvider<boolean>(true);
App.state.emulator.keybind.addProvider(keybindsEnabled);

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Sets whether or not keybinds are enabled.
 * @param enabled True if keybinds are enabled.
 */
export function setEnabled(enabled: boolean): void {
	keybindsEnabled.value = enabled;
}
