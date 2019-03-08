//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Trigger from '@chipotle/wfw/Trigger';

// ---------------------------------------------------------------------------------------------------------------------

class AppTriggers {
	/**
	 * These triggers can be used to redraw components.
	 */
	public redraw = {
		visualizer: new Trigger(),
		visualizerRegisters: new Trigger()
	};

	/**
	 * These triggers can be used to manipulate dialogs.
	 */
	public dialog = {
		load: {
			show: new Trigger(),
			hide: new Trigger()
		}
	};

	/**
	 * These triggers are used to deal with ROMs.
	 */
	public rom = {
		loadRemote: new Trigger(),
		loadLocal: new Trigger()
	};

	/**
	 * These triggers are used to control the emulator.
	 */
	public emulator = {
		pause: new Trigger(),
		resume: new Trigger(),
		reset: new Trigger()
	};

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		this.redraw.visualizer.onTrigger((...args) => {
			this.redraw.visualizerRegisters.trigger(...args);
		});
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default AppTriggers;
export {AppTriggers};
