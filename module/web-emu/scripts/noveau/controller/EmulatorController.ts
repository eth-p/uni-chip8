//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../App';
import StateProvider from '@chipotle/wfw/StateProvider';
import XHR, {XHRType} from '@chipotle/wfw/XHR';

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
	protected isLoading: StateProvider<boolean> = new StateProvider<boolean>(false);

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super();

		// State providers.
		this.state.emulator.loaded.addProvider(this.isLoaded);
		this.state.emulator.loading.addProvider(this.isLoading);

		// State -> Emulator
		this.state.emulator.paused.addListener('change', val => (val ? this.emulator.pause() : this.emulator.resume()));
		this.state.emulator.turbo.addListener('change', val => this.emulator.setTurbo(val));

		// Emulator -> State
		this.emulator.addListener('load', () => (this.isLoaded.value = true));

		// Triggers.
		this.triggers.rom.loadRemote.addListener('trigger', this.loadRemoteProgram.bind(this));
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

	protected async loadRemoteProgram(this: App.Fragment<this>, url: string): Promise<void> {
		this.isLoading.value = true;

		try {
			let xhr = new XHR(url, XHRType.BINARY);
			let rom = await xhr.get();

			await this.emulator.load(rom);
			this.isLoaded.value = true;

			this.emit('load', null);
		} catch (ex) {
			this.emit('load', ex);
		} finally {
			this.isLoading.value = false;
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default EmulatorController;
export {EmulatorController};
