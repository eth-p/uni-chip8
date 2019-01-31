//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import assert from '@chipotle/types/assert';

// ---------------------------------------------------------------------------------------------------------------------
// Audio:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * A class for playing "beep" sounds.
 */
class FeedbackAudio {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The audio fade time (in seconds).
	 */
	protected fadeTime: number;

	/**
	 * A variable for storing the end time of the previous beep.
	 */
	protected endTime: number;

	/**
	 * Whether or not a sound is actively playing.
	 */
	protected active: boolean;

	/**
	 * Whether or not audio is supported.
	 */
	protected supported: boolean;

	/**
	 * The audio volume.
	 */
	protected volume: number;

	/**
	 * The audio frequency.
	 */
	protected frequency: number;

	protected audioContext?: AudioContext;
	protected audioGainOld?: GainNode;
	protected audioGainNew?: GainNode;
	protected audioOscillator?: OscillatorNode;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new audio object.
	 */
	public constructor() {
		this.endTime = 0;
		this.fadeTime = 0.2;
		this.volume = 1;
		this.frequency = 300;
		this.active = false;

		// Create audio context.
		let AudioContext = <{new (): AudioContext}>(<any>window).AudioContext || (<any>window).webkitAudioContext;
		if (AudioContext == null) {
			this.supported = false;
			return;
		}

		this.supported = true;
		this.audioContext = new AudioContext();
		this.audioGainOld = this.audioContext.createGain();
		this.audioGainNew = this.audioContext.createGain();

		// Connect.
		this.audioGainOld.connect(this.audioContext.destination);
		this.audioGainNew.connect(this.audioContext.destination);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Checks if the audio context is blocked by autoplay policies.
	 * @returns True if the audio is blocked.
	 * @see unblock
	 */
	public isBlocked(): boolean {
		if (!this.supported) return false;
		return this.audioContext!.state === 'suspended';
	}

	/**
	 * Attempts to reinitialize (technically resume) the audio context.
	 * This should be used on user input to get around Chrome's autoplay policy.
	 *
	 * https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
	 *
	 * @returns True if the audio is reinitialized properly.
	 */
	public async unblock(): Promise<boolean> {
		if (!this.supported) return true;
		if (!this.isBlocked()) {
			return true;
		}

		await this.audioContext!.resume();
		return !this.isBlocked();
	}

	/**
	 * Creates a beeping sound.
	 * @param duration The number of seconds to beep for.
	 */
	public beep(duration: number): void {
		assert(duration >= 0, 'The duration must be greater than or equal to zero');

		if (!this.supported) return;
		if (duration === 0) return this.stop();
		let currentTime = this.audioContext!.currentTime;

		this.stop();

		// Set up crossfade.
		let gain = this.audioGainNew!.gain;
		if (this.active) {
			gain.setValueAtTime(0.00001, currentTime);
			gain.linearRampToValueAtTime(this.volume, this.audioContext!.currentTime + this.fadeTime);
		} else {
			gain.setValueAtTime(this.volume, currentTime);
		}

		// Create a new oscillator.
		this.endTime = currentTime + duration;
		this.active = true;
		let oscillator = (this.audioOscillator = this.audioContext!.createOscillator());
		oscillator.frequency.value = this.frequency;
		oscillator.type = 'square';
		oscillator.connect(this.audioGainNew!);
		oscillator.start();
		oscillator.stop(this.endTime);
		oscillator.onended = () => {
			if (this.audioOscillator === oscillator) this.active = false;
		};
	}

	/**
	 * Pause sound output.
	 */
	public async pause(): Promise<void> {
		if (!this.supported) return;
		if (this.audioContext!.state === 'running') {
			return this.audioContext!.suspend();
		}
	}

	/**
	 * Resume sound output.
	 */
	public async resume(): Promise<void> {
		if (!this.supported) return;
		if (this.audioContext!.state === 'suspended') {
			return this.audioContext!.resume();
		}
	}

	/**
	 * Stops all sounds.
	 */
	public stop(): void {
		if (!this.supported) return;
		if (this.audioOscillator == null) return;

		// Fade out oscillator to prevent popping.
		let temp = this.audioGainNew!;
		let currentTime = this.audioContext!.currentTime;
		this.audioGainNew = this.audioGainOld;
		this.audioGainOld = temp;
		temp.gain.setValueAtTime(this.audioGainNew!.gain.value, currentTime);
		temp.gain.exponentialRampToValueAtTime(0.00001, currentTime + this.fadeTime);

		// Disconnect oscillator.
		let oscillator = this.audioOscillator;
		setTimeout(() => {
			try {
				oscillator.stop();
			} finally {
				oscillator.disconnect();
			}
		}, this.fadeTime * 1000);
	}

	/**
	 * Gets the beeping frequency.
	 * @returns The frequency.
	 */
	public getFrequency(): number {
		return this.frequency;
	}

	/**
	 * Sets the beeping frequency.
	 * @param frequency The frequency.
	 */
	public setFrequency(frequency: number): void {
		assert(frequency > 0, 'The frequency must be greater than zero');
		assert(frequency < 20000, "The frequency should be less than 20000, unless you're trying to annoy a dog");

		this.frequency = frequency;

		// Return if unsupported.
		if (!this.supported) return;

		// Reapply beep.
		let remaining = this.endTime - this.audioContext!.currentTime;
		if (remaining > 0) {
			this.stop();
			this.beep(remaining);
		}
	}

	/**
	 * Gets the volume.
	 * @returns The volume, from 0 to 100.
	 */
	public getVolume(): number {
		return this.volume * 100;
	}

	/**
	 * Sets the volume.
	 * @param volume The volume, from 0 to 100
	 */
	public setVolume(volume: number): void {
		assert(volume >= 0 && volume <= 100, 'The volume should be from 0 to 100');

		this.volume = volume / 100;
		if (!this.supported) return;
		this.audioGainNew!.gain.value = this.volume;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Exports:
export default FeedbackAudio;
export {FeedbackAudio};
