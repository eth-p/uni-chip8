//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

/**
 * Chip-8 sprite.
 *
 * ```
 * 01101110 => | SS PPP |
 * 01001110 => | S  PPP |
 * 11001000 => |SS  P   |
 * ```
 */
class ChipKeyboard {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	public KEY_0: boolean = false;
	public KEY_1: boolean = false;
	public KEY_2: boolean = false;
	public KEY_3: boolean = false;
	public KEY_4: boolean = false;
	public KEY_5: boolean = false;
	public KEY_6: boolean = false;
	public KEY_7: boolean = false;
	public KEY_8: boolean = false;
	public KEY_9: boolean = false;
	public KEY_A: boolean = false;
	public KEY_B: boolean = false;
	public KEY_C: boolean = false;
	public KEY_D: boolean = false;
	public KEY_E: boolean = false;
	public KEY_F: boolean = false;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new keyboard.
	 */
	public constructor() {}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Resets the keyboard key states.
	 */
	reset() {
		this.KEY_0 = false;
		this.KEY_1 = false;
		this.KEY_2 = false;
		this.KEY_3 = false;
		this.KEY_4 = false;
		this.KEY_5 = false;
		this.KEY_6 = false;
		this.KEY_7 = false;
		this.KEY_8 = false;
		this.KEY_9 = false;
		this.KEY_A = false;
		this.KEY_B = false;
		this.KEY_C = false;
		this.KEY_D = false;
		this.KEY_E = false;
		this.KEY_F = false;
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default ChipKeyboard;
export {ChipKeyboard};
