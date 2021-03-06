//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

import JsonType from '@chipotle/types/JsonType';

/**
 * An abstract timer.
 *
 * This timer is calculated based on a ratio between a main clock speed and a timer clock speed.
 */
abstract class Timer {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The timer value.
	 */
	public value: number;

	/**
	 * The timer ratio.
	 */
	protected ratio: number;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new timer.
	 *
	 * @param cpuHz The main clock speed.
	 * @param timerHz The timer clock speed.
	 */
	protected constructor(cpuHz: number, timerHz: number) {
		this.value = 0;
		this.ratio = timerHz / cpuHz;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Resets the timer.
	 */
	public reset(): void {
		this.value = 0;
	}

	/**
	 * Adjusts the timer ratio.
	 *
	 * @param cpuHz The main clock speed.
	 * @param timerHz The timer clock speed.
	 */
	public adjust(cpuHz: number, timerHz: number) {
		this.ratio = timerHz / cpuHz;
	}

	/**
	 * Creates a JSON-compatible snapshot of the timer.
	 * @returns A snapshot of the timer.
	 */
	public snapshot(): JsonType {
		return this.value;
	}

	/**
	 * Restores a snapshot of the timer.
	 * @param snapshot The JSON-compatible snapshot.
	 */
	public restore(snapshot: any) {
		this.value = snapshot;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods: Abstract                                                                                         |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Ticks the timer forwards by one main clock cycle.
	 */
	public abstract ascend(): void;

	/**
	 * Ticks the timer backwards by one main clock cycle.
	 */
	public abstract descend(): void;
}

// ---------------------------------------------------------------------------------------------------------------------
export default Timer;
export {Timer};
