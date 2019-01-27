//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Emitter from '@chipotle/types/Emitter';
import VMContext from '@chipotle/vm/VMContext';
import Chip from '@chipotle/arch-chip/Chip';

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
		this.intervalRate = 5;
		this.intervalMiss = 0;
		this.lastUpdate = Date.now();
		this._update = this._update.bind(this);
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

		this.lastUpdate = Date.now();
		this.paused = false;
		this.interval = setInterval(this._update, this.intervalRate);
		this.emit('resume');
	}

	/**
	 * Gets the pause state of the emulator.
	 * @returns True if the emulator is paused.
	 */
	public isPaused(): boolean {
		return this.paused;
	}

	/**
	 * Steps the emulator forwards by one instruction.
	 */
	public stepForwards(): void {
		this.vm.step();
	}

	/**
	 * Sets the CPU frequency of the emulator.
	 * @param frequency The frequency.
	 */
	public setFrequency(frequency: number): void {
		this.speed = frequency;
	}

	/**
	 * Gets the CPU frequency of the emulator.
	 * @returns The frequency in cycles per second.
	 */
	public getFrequency(): number {
		return this.speed;
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

	/**
	 * Framerate-independent update.
	 * @protected
	 */
	protected _update() {
		let now = Date.now();
		let ms = now - this.lastUpdate;

		/** The number of ticks to execute. */
		let ticks = this.speed / (1000 / ms) + this.intervalMiss;
		this.intervalMiss = ticks % 1;

		// Execute.
		for (let i = 0; i < ticks; i++) {
			this.vm.step();
		}

		// Set lastUpdate.
		this.lastUpdate = Date.now();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
export default Emulator;
export {Emulator};
