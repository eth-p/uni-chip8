//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Trigger from '@chipotle/wfw/Trigger';

// ---------------------------------------------------------------------------------------------------------------------

class AppTriggers {
	/**
	 * These triggers can be used to manipulate visualizers.
	 */
	public visualizer = {
		stack: {
			render: new Trigger(),
			reset: new Trigger()
		},
		program: {
			render: new Trigger(),
			reset: new Trigger()
		}
	};

	/**
	 * Special container that merges all visualizer triggers.
	 */
	public visualizers = {
		renderAll: new Trigger(),
		resetAll: new Trigger()
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

		settings: {
			show: new Trigger(),
			hide: new Trigger()
		}
	};

	/**
	 * Special container that merges all dialog triggers.
	 */
	public dialogs = {
		hideAll: new Trigger()
	};

	/**
	 * These triggers can be used to manipulate settings.
	 */
	public settings = {
		save: new Trigger(),
		undo: new Trigger(),
		reset: new Trigger()
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
		reset: new Trigger(),
		stepPrev: new Trigger(),
		stepNext: new Trigger()
	};

	/**
	 * These triggers are used to control the screen.
	 */
	public screen = {
		render: new Trigger(),
		resize: new Trigger(),
		reset: new Trigger()
	};

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		// Create merge triggers.
		this.visualizers.renderAll.connectAll(Object.values(this.visualizer).map(r => r.render));
		this.visualizers.resetAll.connectAll(Object.values(this.visualizer).map(r => r.reset));
		this.dialogs.hideAll.connectAll(Object.values(this.dialog).map(r => r.hide));

		// Connect triggers together.
		this.emulator.reset.connect(this.visualizers.resetAll);

		// Any dialog->___->show trigger:
		// Automatically hide other dialogs.
		for (let dTrigger of Object.values(this.dialog)) {
			if ((<any>dTrigger).show instanceof Trigger) {
				(<any>dTrigger).show.onTrigger(() => this.dialogs.hideAll.trigger());
			}
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default AppTriggers;
export {AppTriggers};
