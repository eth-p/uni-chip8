//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
/**
 * A wrapper around requestAnimationFrame that prevents unnecessary calls.
 *
 * An animator can be restricted to only run if specific criteria is met.
 */
class UIAnimator<C extends Criteria> {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected criteria: C;
	protected callback: () => void;
	protected hooked: boolean;
	protected paused: boolean;
	protected step: boolean;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new animator.
	 *
	 * @param callback The animator function.
	 * @param criteria The criteria needed to enable the animator.
	 */
	public constructor(callback: () => void, criteria: C) {
		this.criteria = criteria;
		this.callback = callback;
		this.hooked = false;
		this.paused = true;
		this.step = false;
		this._runFrame = this._runFrame.bind(this);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Returns whether or not this animator is paused.
	 * This can be for one of two reasons:
	 *
	 * 1. The animator was manually paused.
	 * 2. The animator does not meet its criteria.
	 *
	 * @returns True if the animator is paused.
	 */
	public isPaused() {
		return this.paused || !this.hooked;
	}

	/**
	 * Returns whether or not this animator meets its criteria.
	 * @returns True if the animator meets its criteria.
	 */
	public isPossible() {
		for (let v of Object.values(this.criteria)) {
			if (v === false) return false;
		}

		return true;
	}

	/**
	 * Pauses the animator.
	 */
	public pause() {
		this.paused = true;
		this.hooked = false;
	}

	/**
	 * Resumes the animator.
	 */
	public resume() {
		this.paused = false;
		if (this.isPossible() && !this.hooked) {
			this.hooked = true;
			window.requestAnimationFrame(this._runFrame);
		}
	}

	/**
	 * Sets a criterion value.
	 *
	 * @param key The criterion key.
	 * @param value The criterion value.
	 */
	public setCriteria(key: string, value: boolean) {
		if (!(key in this.criteria)) return;
		this.criteria[key] = value;

		if (this.isPossible()) {
			// Resume animating.
			if (!this.hooked && !this.paused) {
				this.hooked = true;
				window.requestAnimationFrame(this._runFrame);
			}
		} else {
			// Pause animating.
			if (this.hooked) {
				this.hooked = false;
			}
		}

		if (this.isPossible() && !this.paused) this.resume();
	}

	/**
	 * Forces the animator to run a frame of the animation immediately.
	 * This is REALLY bad for performance.
	 */
	public run_UNSAFE() {
		this.callback.call(this);
	}

	/**
	 * Runs a single frame of the animation on the next frame cycle.
	 */
	public run() {
		if (!this.isPaused()) return;
		if (this.step) return;
		this.step = true;
		window.requestAnimationFrame(() => {
			this.step = false;
			this.callback();
		});
	}

	protected _runFrame() {
		if (this.hooked) window.requestAnimationFrame(this._runFrame);
		this.callback.call(this);
	}
}

interface Criteria {
	[key: string]: boolean;
}

// ---------------------------------------------------------------------------------------------------------------------
export default UIAnimator;
export {UIAnimator};
