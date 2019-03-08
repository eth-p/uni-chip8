//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Trigger from '@chipotle/wfw/Trigger';

import App from '../App';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The class that handles the play/pause button(s).
 * This stuff isn't simple, sadly.
 */
class PlayPauseController extends App {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected buttons!: HTMLInputElement[];

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected init(this: App.Fragment<this>): void {
		this.buttons = <HTMLInputElement[]>Array.from(document.querySelectorAll('[data-intent="play-pause-resume"]'));

		let update = this.update.bind(this);
		this.state.emulator.errored.addListener('change', update);
		this.state.emulator.paused.addListener('change', update);
		this.state.emulator.loading.addListener('change', update);
		this.state.emulator.loaded.addListener('change', update);
		this.settings.onChange('enable_debugger', update);

		this.update();
		this.ready();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Updates the labels on all the buttons.
	 * This is needed due to the number of possible states.
	 */
	public update() {
		let label = '';
		let trigger = () => {};
		let disabled = false;

		if (this.state.emulator.errored.value && !this.settings.enable_debugger) {
			label = 'Resume';
			disabled = true;
		} else if (!this.state.emulator.loaded.value) {
			label = 'Play';
			disabled = true;
			trigger = this.triggers.emulator.resume.trigger.bind(this.triggers.emulator.resume);
		} else if (this.state.emulator.paused.value) {
			label = 'Resume';
			disabled = false;
			trigger = this.triggers.emulator.resume.trigger.bind(this.triggers.emulator.resume);
		} else if (!this.state.emulator.paused.value) {
			label = 'Pause';
			disabled = false;
			trigger = this.triggers.emulator.pause.trigger.bind(this.triggers.emulator.pause);
		}

		for (let button of this.buttons) {
			button.value = label;
			button.disabled = disabled;
			button.onclick = trigger;
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default PlayPauseController;
export {PlayPauseController};
