//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../App';
import StateProvider from '@chipotle/wfw/StateProvider';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The class that handles user interaction with the emulator.
 * This is a glorified compatibility bridge between the user interface and the emulator itself.
 */
class EmulatorController extends App {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected isLoaded: StateProvider<boolean> = new StateProvider<boolean>(false);

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super();

		// State providers.
		this.state.emulator.loaded.addProvider(this.isLoaded);

		// State -> Emulator
		this.state.emulator.paused.addListener('change', val => (val ? this.emulator.pause() : this.emulator.resume()));
		this.state.emulator.turbo.addListener('change', val => this.emulator.setTurbo(val));

		// Emulator -> State
		this.emulator.addListener('load', () => (this.isLoaded.value = true));
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected init(this: App.Fragment<this>): void {
		this.ready();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------
}

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
export default EmulatorController;
export {EmulatorController};
