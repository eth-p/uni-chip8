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
		},

		error: {
			show: new Trigger(),
			hide: new Trigger(),
			setError: new Trigger()
		},

		hideAll: new Trigger()
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

		this.dialog.hideAll.onTrigger((...args) => {
			this.dialog.load.hide.trigger();
			this.dialog.error.hide.trigger();
		});

		for (let dTrigger of Object.values(this.dialog)) {
			if ((<any>dTrigger).show instanceof Trigger) {
				(<any>dTrigger).show.onTrigger(() => this.dialog.hideAll.trigger());
			}
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default AppTriggers;
export {AppTriggers};
