//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../App';
import StateProvider from '@chipotle/wfw/StateProvider';
import XHR, {XHRType} from '@chipotle/wfw/XHR';
import Emitter from '@chipotle/types/Emitter';

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
	protected isErrored: StateProvider<boolean> = new StateProvider<boolean>(false);

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super();

		// Add state providers.
		this.state.emulator.loaded.addProvider(this.isLoaded);
		this.state.emulator.loading.addProvider(this.isLoading);

		// Map state changes to emulator events.
		this.state.emulator.paused.addListener('change', val => (val ? this.emulator.pause() : this.emulator.resume()));
		this.state.emulator.turbo.addListener('change', val => this.emulator.setTurbo(val));

		// Map emulator events to state changes.
		this.emulator.addListener('load', () => (this.isLoaded.value = true));
		this.emulator.addListener('reset', () => (this.isErrored.value = false));
		this.emulator.addListener('error', error => {
			this.isErrored.value = true;
			(<any>this).emit('error', error, 'emulator');
		});

		// Triggers.
		this.triggers.rom.loadRemote.onTrigger(this.loadRemoteProgram.bind(this));
		this.triggers.rom.loadLocal.onTrigger(this.loadLocalProgram.bind(this));
		this.triggers.emulator.pause.onTrigger(() => (this.state.user.pause.value = true));
		this.triggers.emulator.resume.onTrigger(() => (this.state.user.pause.value = false));
		this.triggers.emulator.reset.onTrigger(() => this.emulator.reset());
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

	/**
	 * Loads a program from a remote URL.
	 * @param url The URL to load from.
	 */
	protected async loadRemoteProgram(this: App.Fragment<this>, url: string): Promise<void> {
		this.isLoading.value = true;

		try {
			let xhr = new XHR(url, XHRType.BINARY);
			let rom = await xhr.get();

			await this.emulator.load(rom);
			this.isLoaded.value = true;

			this.emit('load', null);
		} catch (ex) {
			this.emit('error', ex, 'load');
		} finally {
			this.isLoading.value = false;
		}
	}

	/**
	 * Loads a program from a File or Blob.
	 * This can be used to load files from a file input element.
	 *
	 * @param file The file or blob object.
	 */
	protected async loadLocalProgram(this: App.Fragment<this>, file: File | Blob): Promise<void> {
		this.isLoading.value = true;

		try {
			let rom = <Uint8Array>await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = event => resolve(new Uint8Array(<ArrayBuffer>reader.result!));
				reader.onerror = event => reject(event);
				reader.onabort = event => reject(event);
				reader.readAsArrayBuffer(file);
			});

			await this.emulator.load(rom);
			this.isLoaded.value = true;

			this.emit('load', null);
		} catch (ex) {
			this.emit('error', ex, 'load');
		} finally {
			this.isLoading.value = false;
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default EmulatorController;
export {EmulatorController};
