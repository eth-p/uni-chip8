//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

/**
 * An abstract timer.
 *
 * This timer is calculated based on a ratio between a main clock speed and a timer clock speed.
 */
export default abstract class Timer {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The timer value.
	 */
	public value: number;

	/**
	 * The error correction value.
	 */
	protected error: number;

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
	public constructor(cpuHz: number, timerHz: number) {
		this.value = 0;
		this.error = 0;
		this.ratio = cpuHz / timerHz;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Resets the timer.
	 */
	public reset(): void {
		this.value = 0;
		this.error = 0;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods: Abstract                                                                                         |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Ticks the timer forwards by one main clock cycle.
	 */
	public abstract update(): void;
}
