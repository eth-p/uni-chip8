//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import State from '@chipotle/wfw/State';
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A wrapper around {@link requestAnimationFrame}.
 *
 * The animator attempts to reduce the number of draw calls by only running if specific criteria
 * (a {@link State State<boolean>} object) are met, and only once per frame.
 */
class Animator {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected fn: () => void;
	protected hooked: boolean;
	protected paused: boolean;
	protected step: boolean;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new animator.
	 *
	 * @param state The initial state of the animator.
	 * @param fn The animation function.
	 */
	public constructor(state: State<boolean> | boolean, fn: () => void);

	/**
	 * Creates a new animator that will run immediately.
	 *
	 * @param fn The animation function.
	 */
	public constructor(fn: () => void);

	public constructor(stateOrFn: (() => void) | (State<boolean> | boolean), fn?: () => void) {
		if (fn != null) {
			this.fn = fn;
			let state = <boolean | State<boolean>>stateOrFn;
			if (stateOrFn instanceof State) {
				this.paused = !(<State<boolean>>state).value;
				(<State<boolean>>state).addListener('change', enabled => {
					if (enabled) this.resume();
					else this.pause();
				});
			} else {
				this.paused = <boolean>state;
			}
		} else {
			this.fn = <() => void>stateOrFn;
			this.paused = false;
		}

		this._runFrame = this._runFrame.bind(this);
		this.hooked = false;
		this.step = false;
		if (!this.paused) this.resume();
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
	 * Pauses the animator.
	 * @deprecated Use {@link State} for pause/resume instead.
	 */
	public pause() {
		this.paused = true;
		this.hooked = false;
	}

	/**
	 * Resumes the animator.
	 * @deprecated Use {@link State} for pause/resume instead.
	 */
	public resume() {
		this.paused = false;
		if (!this.hooked) {
			this.hooked = true;
			window.requestAnimationFrame(this._runFrame);
		}
	}

	/**
	 * Forces the animator to run a frame of the animation immediately.
	 * This is REALLY bad for performance.
	 *
	 * @deprecated Just use {@link render}.
	 */
	public renderImmediately() {
		this.fn();
	}

	/**
	 * Runs a single frame of the animation on the next frame cycle.
	 */
	public render() {
		if (!this.isPaused()) return;
		if (this.step) return;
		this.step = true;
		window.requestAnimationFrame(() => {
			this.step = false;
			this.fn();
		});
	}

	protected _runFrame() {
		if (this.hooked) window.requestAnimationFrame(this._runFrame);
		this.fn();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default Animator;
export {Animator};
