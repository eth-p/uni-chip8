//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {ALL_TRUE, ANY_TRUE} from '@chipotle/wfw/StateReducer';
import State from '@chipotle/wfw/State';
import StateProvider from '@chipotle/wfw/StateProvider';

// ---------------------------------------------------------------------------------------------------------------------

class AppState {
	/**
	 * State providers that describe user intention.
	 * These are located here to allow for multiple modules to manipulate the same provider.
	 */
	public user = {
		pause: new StateProvider(false),
		turbo: new StateProvider(false)
	};

	/**
	 * States for the emulator.
	 */
	public emulator = {
		turbo: new State<boolean>(ANY_TRUE),
		paused: new State<boolean>(ANY_TRUE),
		loaded: new State<boolean>(ALL_TRUE),
		keybind: new State<boolean>(ALL_TRUE)
	};
}

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
export default AppState;
export {AppState};
