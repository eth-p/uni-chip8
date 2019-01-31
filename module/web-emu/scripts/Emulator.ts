//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Emitter from '@chipotle/types/Emitter';
import VMContext from '@chipotle/vm/VMContext';
import Chip from '@chipotle/chip-arch/Chip';

// ---------------------------------------------------------------------------------------------------------------------
// Emulator:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * The emulator implementation.
 * Emits the following events:
 *
 * - `keyup`
 * - `keydown`
 * - `pause`
 * - `resume`
 * - `load`
 * - `error`
 */
class Emulator extends Emitter {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Whether or not the emulator is paused.
	 */
	protected paused: boolean;

	/**
	 * Whether or not the emulator is in turbo mode.
	 */
	protected turbo: boolean;

	/**
	 * The setInterval timer ID for calling update.
	 */
	protected interval: number | null;

	/**
	 * The update interval rate.
	 */
	protected intervalRate: number;

	/**
	 * A fraction of missed frames caused by differing clock cycles.
	 */
	protected intervalMiss: number;

	/**
	 * The frequency to run the VM at.
	 * i.e. The number of instructions / second.
	 */
	protected speed: number;

	/**
	 * The virtual machine instance.
	 */
	protected vm: VMContext<Chip>;

	/**
	 * The last time (in milliseconds) update() was called.
	 */
	protected lastUpdate: number;

	/**
	 * The last error that occurred when executing the program.
	 */
	protected lastError?: Error;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new emulator.
	 * @param vm The software virtual machine.
	 */
	public constructor(vm: VMContext<Chip>) {
		super();

		this.vm = vm;
		this.speed = vm.CLOCK_SPEED;
		this.paused = true;
		this.interval = null;
		this.intervalRate = 10;
		this.intervalMiss = 0;
		this.lastUpdate = Date.now();
		this.turbo = false;
		this._update = this._update.bind(this);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Loads a program into the emulator.
	 * @param data The data to load.
	 */
	public async load(data: Uint8Array) {
		await this.vm.program.load(data);
		this.reset();
		this.emit('load');
		this.resume();
	}

	/**
	 * Pauses the emulator.
	 */
	public pause(): void {
		if (this.paused) return;
		this.paused = true;

		// Reset timers.
		if (this.interval != null) clearInterval(this.interval);
		this.emit('pause');
	}

	/**
	 * Resumes the emulator.
	 */
	public resume(): void {
		if (!this.paused) return;
		if (this.vm.program.data == null) return;
		if (this.lastError != null) return;

		this.lastUpdate = Date.now();
		this.paused = false;
		this.interval = setInterval(this._update, this.intervalRate);
		this.emit('resume');
	}

	/**
	 * Resets the emulator.
	 */
	public reset(): void {
		try {
			this.lastError = undefined;
			this.vm.reset();
			this.emit('reset');
			this.lastUpdate = Date.now();
		} catch (ex) {
			this._error(ex);
		}
	}

	/**
	 * Steps the emulator forwards by one instruction.
	 */
	public stepForwards(): void {
		if (!this.paused) this.pause();

		try {
			this.vm.step();
			this.emit('step');
			this.lastUpdate = Date.now();
		} catch (ex) {
			this._error(ex);
		}
	}

	/**
	 * Steps the emulator backwards by one instruction.
	 */
	public stepBackwards(): void {
		if (!this.paused) this.pause();

		// TODO: Unimplemented.
		this.emit('step');
		this._error(new Error('UNIMPLEMENTED.'));
	}

	/**
	 * Notifies the emulator of a keydown event.
	 * @param key The key (0-9, A-F) pressed.
	 */
	public keydown(key: string): void {
		let keyid = `KEY_${key.toUpperCase()}`;
		if ((<any>this.vm.keyboard)[keyid] === true) {
			return;
		}

		this.emit('keydown', key);
		this.vm.emit('input', key);
		(<any>this.vm.keyboard)[keyid] = true;
	}

	/**
	 * Notifies the emulator of a keyup event.
	 * @param key The key (0-9, A-F) pressed.
	 */
	public keyup(key: string): void {
		let keyid = `KEY_${key.toUpperCase()}`;
		if ((<any>this.vm.keyboard)[keyid] === false) {
			return;
		}

		this.emit('keyup', key);
		(<any>this.vm.keyboard)[keyid] = false;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Getters:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Gets the pause state of the emulator.
	 * @returns True if the emulator is paused.
	 */
	public isPaused(): boolean {
		return this.paused;
	}

	/**
	 * Gets the turbo state of the emulator.
	 * @returns True if the emulator is in turbo mode.
	 */
	public isTurbo(): boolean {
		return this.turbo;
	}

	/**
	 * Gets the error state of the emulator.
	 * @returns True if the emulator is halted due to an error.
	 */
	public isError(): boolean {
		return this.lastError != null;
	}

	/**
	 * Gets the CPU frequency of the emulator.
	 * @returns The frequency in cycles per second.
	 */
	public getFrequency(): number {
		return this.speed;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Setters:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Sets the CPU frequency of the emulator.
	 * @param frequency The frequency.
	 */
	public setFrequency(frequency: number): void {
		this.vm.getTimerInstances().forEach(timer => timer.adjust(frequency, this.vm.TIMER_SPEED));
		this.speed = frequency;
	}

	/**
	 * Sets the enabled state of turbo mode.
	 * @param enabled True if turbo should be enabled.
	 */
	public setTurbo(enabled: boolean): void {
		this.turbo = enabled;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Internal:                                                                                                 |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Halts execution and emits an error.
	 * @param exception The error.
	 * @throws The error.
	 * @internal
	 */
	protected _error(exception: Error) {
		this.lastError = exception;
		this.pause();
		this.emit('error', exception);
		throw exception;
	}

	/**
	 * Framerate-independent update.
	 * This will try and catch up on missed cycles.
	 *
	 * @internal
	 */
	protected _update() {
		let now = Date.now();
		let ms = now - this.lastUpdate;

		/** The number of ticks to execute. */
		let ticks;

		if (this.turbo) {
			ticks = 3 * (this.speed / (1000 / this.intervalRate));
		} else {
			ticks = this.speed / (1000 / ms) + this.intervalMiss;
			this.intervalMiss = ticks % 1;
			ticks |= 0;
		}

		// Safety.
		// We don't want a laptop sleeping, then trying to execute more than 1000 instructions.
		if (ticks > 1000) {
			ticks = this.speed / (1000 / this.intervalRate);
		}

		// Execute.
		try {
			for (let i = 0; i < ticks; i++) {
				this.vm.step();
			}
		} catch (ex) {
			this._error(ex);
		}

		// Set lastUpdate.
		this.lastUpdate = Date.now();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
export default Emulator;
export {Emulator};
