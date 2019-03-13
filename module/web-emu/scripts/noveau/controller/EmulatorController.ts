//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import StateProvider from '@chipotle/wfw/StateProvider';
import XHR, {XHRType} from '@chipotle/wfw/XHR';

import App from '../App';
import {emulator} from '../../instance';
import {settings} from '../../settings';

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
	protected isElsewhere: StateProvider<boolean> = new StateProvider<boolean>(false);

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super();

		this.onTickDisableTimer = this.onTickDisableTimer.bind(this);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected initState(this: App.Fragment<this>): void {
		this.state.emulator.loaded.addProvider(this.isLoaded);
		this.state.emulator.loading.addProvider(this.isLoading);
		this.state.emulator.errored.addProvider(this.emulator.getErrorState());
		this.state.emulator.paused.addProvider(this.isElsewhere);
		this.state.emulator.paused.addProvider(() =>
			this.settings.enable_debugger ? false : this.state.emulator.errored.value
		);

		// Map state changes to emulator events.
		this.state.emulator.turbo.addListener('change', val => this.emulator.setTurbo(val));
		this.state.emulator.paused.addListener('change', val => (val ? this.emulator.pause() : this.emulator.resume()));

		// Map emulator events to state changes.
		this.emulator.addListener('load', () => (this.isLoaded.value = true));
		this.emulator.addListener('error', error => (<any>this).emit('error', error, 'emulator'));

		// Map emulator events to triggers.
		this.emulator.addListener('step', () => {
			this.triggers.screen.render.trigger();
			this.triggers.visualizers.renderAll.trigger();
		});

		// Settings.
		this.settings.onChange('cpu_speed', (setting, value) => {
			this.emulator.setFrequency(value);
		});

		this.settings.onChange(['enable_debugger', 'debug_disable_timer'], () => {
			const settings = this.settings;
			const emulator = this.emulator;

			// Setting: debug_disable_timer
			emulator.vm.setDebugOption('DISABLE_DT', settings.enable_debugger && settings.debug_disable_timer);
		});
	}

	protected initTrigger(this: App.Fragment<this>): void {
		this.triggers.rom.loadRemote.onTrigger(this.loadRemoteProgram.bind(this));
		this.triggers.rom.loadLocal.onTrigger(this.loadLocalProgram.bind(this));

		this.triggers.emulator.pause.onTrigger(() => (this.state.user.pause.value = true));
		this.triggers.emulator.resume.onTrigger(() => (this.state.user.pause.value = false));
		this.triggers.emulator.reset.onTrigger(() => this.emulator.reset());
		this.triggers.emulator.stepPrev.onTrigger(() => this.emulator.stepBackwards());
		this.triggers.emulator.stepNext.onTrigger(() => this.emulator.stepForwards());
	}

	protected initListener(this: App.Fragment<this>): void {
		this.addListener('load', () => this.triggers.visualizers.resetAll.trigger());

		// Pause the emulator when it's in another tab.
		document.addEventListener('visibilitychange', () => {
			this.isElsewhere.value = document.hidden;
		});
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Handlers:                                                                                                 |
	// -------------------------------------------------------------------------------------------------------------

	protected onTickDisableTimer(this: App.Fragment<this>): void {
		this.emulator.vm.register_timer = 0;
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
