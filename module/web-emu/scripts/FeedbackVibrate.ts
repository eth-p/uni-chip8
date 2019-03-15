//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '@chipotle/types/assert';

// ---------------------------------------------------------------------------------------------------------------------
// Audio:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A class for making your phone vibrate.
 */
class FeedbackVibrate {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The remaining vibration time after being paused.
	 */
	protected remaining: number;

	/**
	 * The end time of the vibration.
	 */
	protected endTime: number;

	/**
	 * Whether or not the device is actively vibrating.
	 */
	protected active: boolean;

	/**
	 * Whether or not force feedback is paused.
	 */
	protected paused: boolean;

	/**
	 * Whether or not vibration is supported.
	 */
	protected supported: boolean;

	/**
	 * The vibrate function.
	 */
	protected vibratefn: ((ms: number) => void) | null;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new audio object.
	 */
	public constructor() {
		this.paused = false;
		this.active = false;
		this.remaining = 0;
		this.endTime = 0;

		// Determine vibrate function.
		this.vibratefn = <any>(
			((<any>navigator).vibrate ||
				(<any>navigator).webkitVibrate ||
				(<any>navigator).mozVibrate ||
				(<any>navigator).msVibrate)
		);

		if (this.vibratefn != null) {
			this.vibratefn = this.vibratefn.bind(navigator);
		}

		this.supported = this.vibratefn != null;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a beeping sound.
	 * @param duration The number of seconds to beep for.
	 */
	public vibrate(duration: number): void {
		assert(duration >= 0, 'The duration must be greater than or equal to zero');

		let durationMs = Math.floor(duration * 1000);

		if (!this.supported) return;
		if (this.paused) {
			this.remaining = durationMs;
			return;
		}

		if (duration === 0) return this.stop();
		this.endTime = Date.now() + durationMs;
		this.vibratefn!(durationMs);
	}

	/**
	 * Pause vibration output.
	 */
	public async pause(): Promise<void> {
		if (this.paused) return;
		this.paused = true;

		if (!this.supported) return;
		if (this.active) {
			this.remaining = this.endTime - Date.now();
			this.vibrate(this.remaining / 1000);
		}
	}

	/**
	 * Resume vibration output.
	 */
	public async resume(): Promise<void> {
		if (!this.paused) return;
		this.paused = false;

		if (!this.supported) return;
		if (this.remaining > 0) this.vibratefn!(this.remaining);
		this.remaining = 0;
	}

	/**
	 * Stops vibration.
	 */
	public stop(): void {
		if (!this.supported) return;
		this.active = false;
		this.remaining = 0;
		this.vibratefn!(0);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default FeedbackVibrate;
export {FeedbackVibrate};
