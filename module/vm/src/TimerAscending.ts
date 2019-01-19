//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Timer from './Timer';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An ascending timer.
 *
 * This timer is calculated based on a ratio between a main clock speed and a timer clock speed.
 */
export default class TimerAscending extends Timer {
	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * @override
	 */
	public update() {
		let updated = this.value + this.ratio + this.error;
		this.value = updated | 0;
		this.error = updated < 0 ? updated + this.value : updated - this.value;
	}
}
