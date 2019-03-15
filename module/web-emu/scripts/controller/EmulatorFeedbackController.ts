//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import App from '../App';
import FeedbackAudio from '../FeedbackAudio';
import FeedbackVibrate from '../FeedbackVibrate';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * The class that handles feedback from the emulator ST register.
 * - Sound
 * - Vibration
 */
class EmulatorFeedbackController extends App {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected audio: FeedbackAudio;
	protected vibrate: FeedbackVibrate;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super();

		this.audio = new FeedbackAudio();
		this.vibrate = new FeedbackVibrate();
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Hooks:                                                                                                    |
	// -------------------------------------------------------------------------------------------------------------

	protected initListener(this: App.Fragment<this>): void {
		// Pause/resume on emulator pause/resume.
		this.state.emulator.paused.addListener('change', v => {
			if (v) {
				this.pause();
			} else {
				this.resume();
			}
		});

		// Stop on emulator reset.
		this.triggers.emulator.reset.onTrigger(() => this.reset());

		// Listen for changes to ST.
		this.emulator.vm.addListener('sound', cycles => {
			let seconds = cycles / this.emulator.vm.TIMER_SPEED;
			if (this.emulator.isTurbo()) seconds /= 3;
			this.start(seconds);
		});

		// Listen for changes to the settings.
		this.settings.onChange('sound_volume', (s, v) => this.audio.setVolume(v));
		this.settings.onChange('sound_frequency', (s, f) => this.audio.setFrequency(f));

		// If the context isn't running from the beginning, we hit the Chrome autoplay policy.
		// To remedy this, we need to resume it as a result of user input.
		{
			const audio = this.audio;
			const events = ['mousedown', 'touchstart', 'input', 'click'];
			if (audio.isBlocked()) {
				let setup = async function() {
					await audio.unblock();
					if (!audio.isBlocked()) {
						events.forEach(event => window.removeEventListener(event, setup));
					}
				};

				events.forEach(event => window.addEventListener(event, setup));
			}
		}
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Starts feedback.
	 * @param seconds The duration, in seconds.
	 */
	public start(seconds: number) {
		if (this.settings.enable_feedback_vibrate) this.vibrate.vibrate(seconds);
		if (this.settings.enable_feedback_sound) this.audio.beep(seconds);
	}

	/**
	 * Pauses feedback.
	 */
	public pause(): void {
		this.audio.pause();
		this.vibrate.pause();
	}

	/**
	 * Resumes feedback.
	 */
	public resume(): void {
		this.audio.resume();
		this.vibrate.resume();
	}

	/**
	 * Stops all feedback.
	 */
	public reset(): void {
		this.audio.stop();
		this.vibrate.stop();
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default EmulatorFeedbackController;
export {EmulatorFeedbackController};
