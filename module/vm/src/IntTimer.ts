//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Timer from './Timer';
import JsonType from '@chipotle/types/JsonType';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * An integer timer.
 * This timer will only report integer values.
 */
class IntTimer extends Timer {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The error correction value.
	 */
	public error: number;

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
		super(cpuHz, timerHz);
		this.error = 0;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods: Override                                                                                         |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * @inheritDoc
	 * @override
	 */
	public reset(): void {
		super.reset();
		this.error = 0;
	}

	/**
	 * @inheritDoc
	 * @override
	 */
	public ascend(): void {
		let updated = this.value + this.ratio + this.error;

		this.value = updated | 0;
		this.error = updated - this.value;
	}

	/**
	 * @inheritDoc
	 * @override
	 */
	public descend(): void {
		let updated = this.value - this.ratio + this.error;

		this.value = updated | 0;
		this.error = updated - this.value;
	}

	/**
	 * @inheritDoc
	 * @override
	 */
	public snapshot(): JsonType {
		return {
			value: this.value,
			error: this.error
		};
	}

	/**
	 * @inheritDoc
	 * @override
	 */
	public restore(snapshot: any) {
		this.value = snapshot.value;
		this.error = snapshot.error;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default IntTimer;
export {IntTimer};
