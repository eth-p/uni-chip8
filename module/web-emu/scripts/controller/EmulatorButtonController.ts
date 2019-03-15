//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../App';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The class that handles the play/pause button(s).
 * This stuff isn't simple, sadly.
 */
class EmulatorButtonController extends App {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected buttonsPause!: HTMLInputElement[];
	protected buttonsReset!: HTMLInputElement[];

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super();
		this.update = this.update.bind(this);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected initDOM(this: App.Fragment<this>): void {
		this.buttonsPause = <HTMLInputElement[]>(
			Array.from(document.querySelectorAll('[data-intent="play-pause-resume"]'))
		);
		this.buttonsReset = <HTMLInputElement[]>Array.from(document.querySelectorAll('[data-intent="reset"]'));
		this.update();
	}

	protected initTrigger(this: App.Fragment<this>): void {
		this.state.emulator.errored.addListener('change', this.update);
		this.state.emulator.paused.addListener('change', this.update);
		this.state.emulator.loading.addListener('change', this.update);
		this.state.emulator.loaded.addListener('change', this.update);
	}

	protected initListener(this: App.Fragment<this>): void {
		this.settings.onChange('enable_debugger', this.update);
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

		for (let button of this.buttonsPause) {
			button.value = label;
			button.disabled = disabled;
			button.onclick = trigger;
		}

		// And the reset buttons...
		for (let button of this.buttonsReset) {
			button.disabled = !this.state.emulator.loaded.value;
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default EmulatorButtonController;
export {EmulatorButtonController};
