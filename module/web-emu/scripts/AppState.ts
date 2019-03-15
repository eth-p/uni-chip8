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
	 * States for dialogs.
	 */
	public dialog = {
		visible: new State<boolean>(ANY_TRUE)
	};

	/**
	 * States for the emulator.
	 */
	public emulator = {
		turbo: new State<boolean>(ANY_TRUE),
		paused: new State<boolean>(ANY_TRUE),
		running: new State<boolean>(ALL_TRUE),
		loading: new State<boolean>(ANY_TRUE),
		loaded: new State<boolean>(ALL_TRUE),
		keybind: new State<boolean>(ALL_TRUE),
		errored: new State<boolean>(ANY_TRUE)
	};

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	constructor() {
		this.emulator.turbo.addProvider(this.user.turbo);
		this.emulator.paused.addProvider(this.user.pause);
		this.emulator.paused.addProviderFrom(this.emulator.loading, v => v);
		this.emulator.paused.addProviderFrom(this.emulator.loaded, v => !v);
		this.emulator.running.addProviderFrom(this.emulator.paused, v => !v);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default AppState;
export {AppState};
